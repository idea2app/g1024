import { FC, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { withBrowerWeb3, DelphinusWeb3 } from "web3subscriber/src/client";
import {
  ProvingParams,
  ZkWasmUtil,
  WithSignature,
} from "zkwasm-service-helper";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ModalCommon, ModalCommonProps, ModalStatus } from "./base";
import { CommonBg } from "../components/CommonBg";
import { addProvingTask, loadStatus } from "../data/statusSlice";
import { selectL1Account } from "../data/accountSlice";
import "./style.scss";

interface NewWASMImageProps {
  md5: string;
  inputs: string;
  witness: string;
}

export async function signMessage(message: string) {
  const signature = await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    const provider = web3.web3Instance.currentProvider;
    if (!provider) {
      throw new Error("No provider found!");
    }
    const [account] = await web3.web3Instance.eth.getAccounts();
    const msg = web3.web3Instance.utils.utf8ToHex(message);
    const sig = await (provider as any).request({
      method: "personal_sign",
      params: [msg, account],
    });

    return sig;
  });

  return signature;
}

export function NewProveTask(props: NewWASMImageProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);

  const { md5, inputs, witness } = props;
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<ModalStatus>(ModalStatus.PreConfirm);

  const prepareNewProveTask = async function () {
    const info: ProvingParams = {
      user_address: account!.address.toLowerCase(),
      md5,
      public_inputs: [inputs],
      private_inputs: [witness],
    };

    const msgString = ZkWasmUtil.createProvingSignMessage(info);

    let signature: string;
    try {
      setMessage("Waiting for signature...");
      signature = await signMessage(msgString);
      setMessage("Submitting new prove task...");
    } catch (e: unknown) {
      console.log("error signing message", e);
      setStatus(ModalStatus.PreConfirm);
      setMessage("Error signing message");
      throw Error("Unsigned Transaction");
    }

    const task: WithSignature<ProvingParams> = {
      ...info,
      signature,
    };

    return task;
  };

  const addNewProveTask = async function () {
    let task = await prepareNewProveTask();

    try {
      await dispatch(addProvingTask(task)).unwrap();

      setStatus(ModalStatus.PostConfirm);
    } catch (error) {
      console.log("new prove task error", error);
      setMessage("Error creating new prove task.");
      setStatus(ModalStatus.PreConfirm);
    }

    const query = {
      user_address: account!.address,
      md5,
      id: "",
      tasktype: "Prove",
      taskstatus: "",
    };

    dispatch(loadStatus(query));
  };

  const FormGroup: FC<Record<"label" | "value", string>> = ({
    label,
    value,
  }) => (
    <Form.Group className="mb-3">
      <Form.Label variant="dark">{label}</Form.Label>
      <CommonBg>
        <div className="p-3">{value}</div>
      </CommonBg>
    </Form.Group>
  );

  const content = (
    <>
      <Container>
        <FormGroup label="Image ID(MD5):" value={md5} />
        <FormGroup label="Public Inputs:" value={inputs} />
        <FormGroup label="Witness Inputs:" value={witness} />
      </Container>
    </>
  );

  let modalprops: ModalCommonProps = {
    btnLabel: <button className="sell-button">Submit Proof</button>,
    title: ["Submit ", "Your Game Play"],
    childrenClass: "",
    handleConfirm: addNewProveTask,
    handleClose: () => setStatus(ModalStatus.PreConfirm),
    children: content,
    valid: true,
    message: message,
    status: status,
    confirmLabel: "Confirm",
  };
  return ModalCommon(modalprops);
}
