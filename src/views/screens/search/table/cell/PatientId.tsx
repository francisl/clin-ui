import { Button } from 'antd';
import { redirectParent } from 'utils/bridge';

type PatientIdCellProps = {
  patientId: string;
};

const PatientIdCell = ({ patientId }: PatientIdCellProps) => (
  <Button
    type="link"
    onClick={() => {
      redirectParent(`/patient/${patientId}`);
    }}
  >
    {patientId}
  </Button>
);

export default PatientIdCell;
