import { gql } from '@apollo/client';

import { ExtendedMapping } from 'store/graphql/models';
import { dotToUnderscore, underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { MappingResults } from 'store/graphql/variants/actions';

export const VARIANT_QUERY = gql`
  query VariantInformation($sqon: JSON, $pageSize: Int, $offset: Int, $sort: [Sort]) {
    Variants {
      hits(filters: $sqon, first: $pageSize, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            hgvsg
            hash
            locus
            variant_class
            clinvar {
              clinvar_id
              clin_sig
            }
            panels
            variant_type
            max_impact_score
            rsnumber
            chromosome
            start
            consequences {
              hits {
                edges {
                  node {
                    symbol
                    #canonical
                    vep_impact
                    consequences
                    aa_change
                    impact_score
                  }
                }
              }
            }

            varsome {
              acmg {
                verdict {
                  benign_subscore
                  clinical_score
                  pathogenic_subscore
                  verdict
                }
                classifications {
                  hits {
                    edges {
                      node {
                        met_criteria
                        name
                      }
                    }
                  }
                }
              }
              variant_id
            }

            donors {
              hits {
                total
                edges {
                  node {
                    patient_id
                    organization_id
                    gender
                    is_proband
                    family_id
                    zygosity
                    transmission
                    last_update
                    ad_alt
                    ad_total
                    ad_ratio
                    affected_status
                    qd
                    gq
                    filters
                    mother_id
                    mother_zygosity
                    mother_affected_status
                    mother_calls
                    father_id
                    father_zygosity
                    father_affected_status
                    father_calls
                    parental_origin
                  }
                }
              }
            }

            frequency_RQDM {
              total {
                pc
                pn
                pf
              }
            }

            external_frequencies {
              gnomad_exomes_2_1_1 {
                af
              }
            }

            genes {
              hits {
                edges {
                  node {
                    symbol
                    biotype
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const TAB_FREQUENCIES_QUERY = gql`
  query GetFrequenciesTabVariant($sqon: JSON) {
    Variants {
      hits(filters: $sqon) {
        edges {
          node {
            locus
            frequencies_by_analysis {
              hits {
                edges {
                  node {
                    analysis_code
                    analysis_display_name
                    affected {
                      ac
                      af
                      an
                      pn
                      pf
                      pc
                      hom
                    }
                    non_affected {
                      ac
                      af
                      an
                      pn
                      pf
                      pc
                      hom
                    }
                    total {
                      ac
                      af
                      an
                      pn
                      pf
                      pc
                      hom
                    }
                  }
                }
              }
            }
            external_frequencies {
              topmed_bravo {
                ac
                af
                an
                hom
                het
              }
              thousand_genomes {
                ac
                af
                an
              }
              gnomad_exomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_3_0 {
                ac
                af
                an
                hom
              }
            }
            frequency_RQDM {
              affected {
                ac
                af
                an
                pn
                pf
                pc
                hom
              }
              non_affected {
                ac
                af
                an
                pn
                pf
                pc
                hom
              }
              total {
                ac
                af
                an
                pn
                pf
                pc
                hom
              }
            }
          }
        }
      }
    }
  }
`;

export const TAB_SUMMARY_QUERY = gql`
  query GetSummaryTabVariant($sqon: JSON) {
    Variants {
      hits(filters: $sqon) {
        total
        edges {
          node {
            alternate
            chromosome
            hgvsg
            hash
            locus
            clinvar {
              clinvar_id
              clin_sig
            }
            rsnumber
            reference
            start
            variant_type
            max_impact_score
            variant_class
            assembly_version
            last_annotation_update
            frequency_RQDM {
              total {
                ac
                af
                an
                hom
                pn
                pc
                pf
              }
            }
            consequences {
              hits {
                edges {
                  node {
                    biotype
                    symbol
                    vep_impact
                    symbol
                    consequences
                    ensembl_gene_id
                    coding_dna_change
                    aa_change
                    strand
                    canonical
                    conservations {
                      phylo_p17way_primate_rankscore
                    }
                    refseq_mrna_id
                    ensembl_transcript_id
                    predictions {
                      fathmm_pred
                      FATHMM_converted_rankscore
                      cadd_score
                      dann_score
                      lrt_pred
                      lrt_converted_rankscore
                      revel_rankscore
                      sift_converted_rank_score
                      sift_pred
                      polyphen2_hvar_score
                      polyphen2_hvar_pred
                    }
                    impact_score
                  }
                }
              }
            }
            genes {
              hits {
                edges {
                  node {
                    omim_gene_id
                    symbol
                    location
                    biotype
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const TAB_CLINICAL_QUERY = gql`
  query GetClinicalTabVariant($sqon: JSON) {
    Variants {
      hits(filters: $sqon) {
        edges {
          node {
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                    omim_gene_id
                    omim {
                      hits {
                        edges {
                          node {
                            omim_id
                            name
                            inheritance
                          }
                        }
                      }
                    }
                    orphanet {
                      hits {
                        edges {
                          node {
                            panel
                            inheritance
                            disorder_id
                          }
                        }
                      }
                    }
                    cosmic {
                      hits {
                        edges {
                          node {
                            tumour_types_germline
                          }
                        }
                      }
                    }
                    hpo {
                      hits {
                        edges {
                          node {
                            hpo_term_label
                            hpo_term_id
                          }
                        }
                      }
                    }
                    ddd {
                      hits {
                        edges {
                          node {
                            disease_name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const TAB_PATIENT_QUERY = gql`
  query GetPatientTabVariant($sqon: JSON, $pageSize: Int, $offset: Int, $sort: [Sort]) {
    Variants {
      hits(filters: $sqon, first: $pageSize, offset: $offset, sort: $sort) {
        edges {
          node {
            donors {
              hits {
                total
                edges {
                  node {
                    patient_id
                    organization_id
                    analysis_code
                    analysis_display_name
                    gender
                    filters
                    is_proband
                    family_id
                    zygosity
                    last_update
                    ad_alt
                    ad_total
                    ad_ratio
                    affected_status
                    qd
                    gq
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const VARIANT_STATS_QUERY = gql`
  query VariantStats {
    variantStats {
      hits {
        edges {
          node {
            distinctVariantsCount
            occurrencesCount
            participantsCount
            studiesCount
          }
        }
      }
    }
  }
`;

export const VARIANT_AGGREGATION_QUERY = (aggList: string[], mappingResults: MappingResults) => {
  if (!mappingResults || mappingResults.loadingMapping) return gql``;

  const aggListDotNotation = aggList.map((i) => underscoreToDot(i));

  const extendedMappingsFields = aggListDotNotation.flatMap((i) =>
    (mappingResults?.extendedMapping || []).filter((e) => e.field === i),
  );

  return gql`
      query VariantInformation($sqon: JSON) {
        Variants {
           aggregations (filters: $sqon, include_missing:false){
            ${generateAggregations(extendedMappingsFields)}
          }
        }
      }
    `;
};

const generateAggregations = (extendedMappingFields: ExtendedMapping[]) => {
  const aggs = extendedMappingFields.map((f) => {
    if (['keyword', 'id'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) + ' {\n     buckets {\n      key\n        doc_count\n    }\n  }'
      );
    } else if (['long', 'float', 'integer', 'date'].includes(f.type)) {
      return dotToUnderscore(f.field) + '{\n    stats {\n  max\n   min\n    }\n    }';
    } else if (['boolean'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) +
        ' {\n      buckets {\n       key\n       doc_count\n     }\n    }'
      );
    } else {
      return '';
    }
  });
  return aggs.join(' ');
};
