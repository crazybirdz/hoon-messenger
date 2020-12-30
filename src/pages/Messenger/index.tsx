import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Button, Input } from 'antd';
import {
  PhoneFilled,
  VideoCameraFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  SmileFilled,
  LikeFilled,
} from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import './Messenger.scss';
import Sidebar from '@components/Sidebar';
import { useSelector } from 'react-redux';
import { authSelector } from '@lib/auth';
import { userType } from '@utils/types';
import { createMessenger, getUser, getMessages } from '@lib/db';
import IconBtnBlue from '@components/IconBtnBlue';

// default content
// TODO: create messenger
// TODO: push message
// TODO: set onSnapshot
// TODO: check onSnapshot
// TODO: get message
// TODO: message UI
// TODO: check working well(2 users)

const { Title } = Typography;

interface MatchParams {
  uid: string;
}

type messageType = {
  uid: string;
  text: string;
  createdAt: string;
};

const Messenger: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const [counterpart, setCounterpart] = useState<null | userType>(null);
  const [haveMessenger, setHaveMessenger] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [messages, setMessages] = useState<null | messageType[]>(null);
  const user = useSelector(authSelector.user);
  useEffect(() => {
    async function getCounterpart(uid1: string, uid2: string) {
      const user = (await getUser(uid2)) as userType;
      const messages = await getMessages(uid1, uid2);

      if (messages) {
        setHaveMessenger(true);
      }

      setCounterpart(user);
      setMessages(messages);
    }
    getCounterpart(user?.uid!, match.params.uid);
    // eslint-disable-next-line
  }, []);

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (haveMessenger === false) {
        await createMessenger(user?.uid!, match.params.uid, inputVal);
        const messages = await getMessages(user?.uid!, match.params.uid);
        setMessages(messages);
        setHaveMessenger(true);
      } else {
      }
      setInputVal('');
    }
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  return (
    <div className='messengerLayout'>
      <div className='messengerLayout__sidebar'>
        <Sidebar />
      </div>
      <div className='messenger'>
        <div className='messenger__header'>
          <div className='header__left'>
            <Avatar size='large' src={counterpart?.avatarUrl} />
            <Title level={4}>{counterpart?.name}</Title>
          </div>
          <div className='header__right'>
            <IconBtnBlue icon={<PhoneFilled style={{ fontSize: '20px' }} />} />
            <IconBtnBlue
              icon={<VideoCameraFilled style={{ fontSize: '20px' }} />}
            />
            <IconBtnBlue
              icon={<InfoCircleFilled style={{ fontSize: '20px' }} />}
            />
          </div>
        </div>
        <div className='messenger__content'>
          <div className='content__default'>
            {!haveMessenger ? (
              <>
                {' '}
                <Avatar src={counterpart?.avatarUrl} size={60} />
                <Title level={3}>{counterpart?.name}</Title>{' '}
              </>
            ) : (
              messages?.map((message) => {
                if (message.uid === user?.uid) {
                  return <div key={message.createdAt}>user text</div>;
                } else {
                  return <div key={message.createdAt}>counterpart texts</div>;
                }
              })
            )}
          </div>
        </div>
        <div className='messenger__footer'>
          <div className='footer__left'>
            <IconBtnBlue
              icon={<PlusCircleFilled style={{ fontSize: '20px' }} />}
            />
          </div>
          <div className='footer__center'>
            <Input
              placeholder='Aa'
              suffix={
                <SmileFilled style={{ fontSize: '18px', color: '#1890ff' }} />
              }
              onKeyPress={handleEnter}
              onChange={handleInputOnChange}
              value={inputVal}
            />
          </div>
          <div className='footer__right'>
            <IconBtnBlue icon={<LikeFilled style={{ fontSize: '20px' }} />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Messenger);
