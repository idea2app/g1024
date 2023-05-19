import React, { useEffect } from "react";
import { Table } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadStatus, selectTasks } from "../data/statusSlice";
import { selectL1Account } from "../data/accountSlice";
import { ProofInfoModal } from "../modals/proofInfo";

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

  dispatch(loadStatus(query));
  let tasks = useAppSelector(selectTasks);

  useEffect(() => {
    if (account) {
      dispatch(loadStatus(query));
    }
  }, [account]);

  return (
    <Table className="rounded">
      <thead>
        <tr>
          <th>Task ID</th>
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
                <td>
                  <span>{d._id["$oid"]}</span>
                </td>
                <td>
                  <span>{d.user_address}</span>
                </td>
                <td>
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
