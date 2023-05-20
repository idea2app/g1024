import React, { useEffect } from "react";
import { Image, Table } from "react-bootstrap";
import classNames from "classnames";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadStatus, selectTasks } from "../data/statusSlice";
import { selectL1Account } from "../data/accountSlice";
import { ProofInfoModal } from "../modals/proofInfo";
import { shortenString } from "../utils/string";
import User from "../images/people.svg";

export interface UserHistoryProps {
  md5: string;
}

export default function ImageDetail(props: UserHistoryProps) {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);
  const query = {
    md5: props.md5,
    user_address: account ? account!.address : "",
    id: "",
    tasktype: "Prove",
    taskstatus: "",
  };

  // UI Loading states
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  let tasks = useAppSelector(selectTasks);

  useEffect(() => {
    // if (account) {
      dispatch(loadStatus(query));
    // }
  }, [account]);

  return (
    <Table className="rounded">
      <thead>
        <tr>
          <th className="ps-lg-5">Task ID</th>
          <th>Submitted by</th>
          <th>Status</th>
          <th>Proof Details</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((d) => {
          return (
            <>
              <tr key={d._id["$oid"]}>
                <td className="ps-lg-5">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://zkwasm-explorer.delphinuslab.com/image/${d._id["$oid"]}`}
                  >
                    {shortenString(d._id["$oid"])}
                  </a>
                </td>
                <td>
                  <Image className="me-2" src={User} />
                  {shortenString(d.user_address)}
                </td>
                <td
                  className={classNames({
                    "text-success": d.status === "Done",
                  })}
                >
                  <Image
                    className="me-2"
                    src={`/${d.status.toLowerCase()}.png`}
                  />
                  <span>{d.status}</span>
                </td>
                <td>
                  <ProofInfoModal task={d}></ProofInfoModal>
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    </Table>
  );
}
