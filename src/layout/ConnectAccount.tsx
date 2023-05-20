import React, {createRef, useEffect, useRef,useState } from 'react';

import { useAppDispatch,useAppSelector } from '../app/hooks';
import {
  loginL1AccountAsync,
  selectL1Account,
} from "../data/accountSlice";

export function Connect() {
  let account = useAppSelector(selectL1Account);
  const dispatch = useAppDispatch();
  const connect = () => {
    dispatch(loginL1AccountAsync());
  };

  if (!account) {
    return(
    <>
    <div className="connect-account">
        <div onClick={() => connect()}>connect account</div>
    </div>
    </>
    );
  } else {
    //console.log("connected", account);
    return (<></>);
  }

}
