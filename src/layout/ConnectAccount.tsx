import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginL1AccountAsync, selectL1Account } from '../data/accountSlice';

export const Connect = () => {
  const account = useAppSelector(selectL1Account);
  const dispatch = useAppDispatch();
  const connect = () => {
    dispatch(loginL1AccountAsync());
  };

  if (account) return;

  return (
    <div className="connect-account">
      <div onClick={() => connect()}>connect account</div>
    </div>
  );
};
