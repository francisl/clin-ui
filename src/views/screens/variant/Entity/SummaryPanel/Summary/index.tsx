/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Card, Col, Divider, Row, Spin, Typography } from 'antd';
import { GeneEntity, VariantEntity } from 'graphql/variants/models';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import intl from 'react-intl-universal';
import { formatTimestampToISODate } from 'utils/helper';
import history from 'utils/history';
import { ArrangerEdge } from 'graphql/models';

import styles from './index.module.scss';

interface OwnProps {
  loading: boolean;
  variant: VariantEntity | null;
  genes: ArrangerEdge<GeneEntity>[];
}

const { Text } = Typography;

const SummaryCard = ({ loading, variant, genes }: OwnProps) => {
  return(
  <Card className={styles.summaryCard}>
    <Spin spinning={loading}>
      <Row>
        <Col>
          <Card className={styles.infoCard}>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>
                {intl.get('screen.variantDetails.summaryTab.summaryTable.chromosome')}
              </Text>
              <Text className={styles.infoValue}>{variant?.chromosome}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>
                {intl.get('screen.variantDetails.summaryTab.summaryTable.start')}
              </Text>
              <Text className={styles.infoValue}>{variant?.start}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>
                {intl.get('screen.variantDetails.summaryTab.summaryTable.alleleAlt')}
              </Text>
              <Text className={styles.infoValue}>{variant?.alternate}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>
                {intl.get('screen.variantDetails.summaryTab.summaryTable.alleleRef')}
              </Text>
              <Text className={styles.infoValue}>{variant?.reference}</Text>
            </Row>
          </Card>
        </Col>
        <Col className={styles.resumeContent}>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>
              {intl.get('screen.variantDetails.summaryTab.summaryTable.type')}
            </Text>
            <Text className={styles.contentValue}>{variant?.variant_class}</Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>
              {intl.get('screen.variantDetails.summaryTab.summaryTable.cytoband')}
            </Text>
            <Text className={styles.contentValue}>
              {genes && genes[0]
                ? genes[0].node.location || DISPLAY_WHEN_EMPTY_DATUM
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>
              {intl.get('screen.variantDetails.summaryTab.summaryTable.genomeRef')}
            </Text>
            <Text className={styles.contentValue}>{variant?.assembly_version}</Text>
          </Row>
        </Col>
        <Divider className={styles.divider} type="vertical" />
        <Col className={styles.resumeContent}>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>ClinVar</Text>
            <Text className={styles.contentValue}>
              {variant?.clinvar?.clin_sig && variant?.clinvar.clinvar_id ? (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variant?.clinvar.clinvar_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {variant?.clinvar.clin_sig.join(', ')}
                </a>
              ) : (
                DISPLAY_WHEN_EMPTY_DATUM
              )}
            </Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>dbSNP</Text>
            <Text className={styles.contentValue}>
              {variant?.rsnumber ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.ncbi.nlm.nih.gov/snp/${variant?.rsnumber}`}
                >
                  {variant?.rsnumber}
                </a>
              ) : (
                DISPLAY_WHEN_EMPTY_DATUM
              )}
            </Text>
          </Row>
        </Col>
        <Divider className={styles.divider} type="vertical" />
        <Col className={styles.resumeContent}>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>Patients</Text>
            <Text className={styles.contentValue}>
              <a onClick={() => history.push(`/variant/entity/${variant?.hash}/patients`)}>
                {variant?.frequency_RQDM.total.pn}
              </a>
              /{variant?.frequency_RQDM.total.an}
            </Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>
              {intl.get('screen.variantDetails.summaryTab.patientTable.frequencies')}
            </Text>
            <Text className={styles.contentValue}>
              {variant?.frequency_RQDM?.total?.af.toExponential(2)}
            </Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>Annotations</Text>
            <Text className={styles.contentValue}>
              {variant?.last_annotation_update
                ? formatTimestampToISODate(variant?.last_annotation_update)
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Text>
          </Row>
        </Col>
      </Row>
    </Spin>
  </Card>
  )
};

export default SummaryCard;
