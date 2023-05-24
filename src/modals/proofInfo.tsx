import './style.scss';

import BN from 'bn.js';
import { Container, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { Task } from 'zkwasm-service-helper';

import { useAppSelector } from '../app/hooks';
import { selectL1Account } from '../data/accountSlice';
import { zkwasmHelper } from '../data/endpoint';
import { contract_abi, parseArgs } from '../data/image';
import { Inputs } from '../utils/inputs';
import { bytesToBN } from '../utils/proof';
import { ModalCommon, ModalCommonProps, ModalStatus } from './base';

export interface ProofInfoProps {
  task: Task;
}

export function ProofInfoModal(info: ProofInfoProps) {
  const account = useAppSelector(selectL1Account);
  const task = info.task;
  const aggregate_proof = bytesToBN(task.proof);
  const instances = bytesToBN(task.instances);
  const aux = bytesToBN(task.aux);

  async function testverify() {
    if (account) {
      const web3 = account.web3!;
      const image = await zkwasmHelper.queryImage(info.task.md5);
      if (image.deployment.length > 0) {
        const [{ address }] = image.deployment;
        const verify_contract = new web3.eth.Contract(
          contract_abi.abi,
          address,
          { from: account!.address },
        );
        const args = parseArgs(task.public_inputs).map(x => x.toString(10));
        const result = await verify_contract.methods
          .verify(aggregate_proof, instances, aux, [args])
          .send();
        console.log(`verification result: ${result}`);
      }
    } else {
      console.error('walconst not connected');
    }
  }
  const taskproof = (
    <>
      <Container>
        <Tabs defaultActiveKey="Inputs" className="mb-3" justify>
          <Tab eventKey="Inputs" title="Inputs">
            <p>
              Public Inputs: <Inputs inputs={task.public_inputs}></Inputs>
            </p>
            <p>
              Witness: <Inputs inputs={task.private_inputs}></Inputs>
            </p>
          </Tab>
          <Tab eventKey="Instances" title="Instances">
            {instances.map(proof => (
              <ListGroup.Item key={proof.toString('hex')}>
                0x{proof.toString('hex')}
              </ListGroup.Item>
            ))}
          </Tab>
          <Tab eventKey="prooftranscript" title="Proof Transcripts">
            <div className="scroll-300">
              {aggregate_proof.map((proof: BN) => {
                return (
                  <ListGroup.Item key={proof.toString('hex')}>
                    0x{proof.toString('hex')}
                  </ListGroup.Item>
                );
              })}
            </div>
          </Tab>
          <Tab eventKey="auxdata" title="Aux Data">
            {aux.map((proof: BN) => {
              return (
                <ListGroup.Item key={proof.toString('hex')}>
                  0x{proof.toString('hex')}
                </ListGroup.Item>
              );
            })}
          </Tab>
        </Tabs>
      </Container>
    </>
  );
  const props: ModalCommonProps = {
    buttonLabel: <button className="appearance-none">Click to show</button>,
    title: ['Proof ', 'Information'],
    childrenClass: '',
    onConfirm: testverify,
    valid: true,
    status: ModalStatus.PreConfirm,
    children: taskproof,
    message: '',
    confirmLabel: 'verify on chain',
  };
  return ModalCommon(props);
}
