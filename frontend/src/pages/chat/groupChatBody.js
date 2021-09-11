import { DeleteOutlined, UploadOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Comment, Input, Popover, Tooltip } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import io from "socket.io-client";
import { ChatLayout } from '../../components/chat/ChatLayout';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { isAuthenticated } from '../../components/auth/auth';


let socket;
export const GroupChatBody = (props) => {

  useEffect(() => {
    if (window.location.href.includes('confirm-email')) {
        return true;
    }
    else if (isAuthenticated().verification == false) {
        props.history.push('/verify-email');
    } else {
        return true;
    }

    return () => {

    }
}, []);
  const groupId = props.match.params.id;
  const user = isAuthenticated();
  const [chatMessage, setChatMessage] = useState("");
  const [getMessage, setGetMessage] = useState([]);
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState('');
  let ENDPOINT;
  if (process.env.NODE_ENV === 'production') {
    ENDPOINT = "https://mychatapp786.herokuapp.com/";
  }
  else {
    ENDPOINT = "http://localhost:8000";
  }


  const onChange = e => {
    setChatMessage(e.target.value);
  };


  const getGroupChat = async () => {
    await axios.post(`/api/chats/group-chat`, { groupId }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        setGetMessage(res.data.result);
      }
      else {
        setGetMessage('');
      }
    })
  }

  const getGroupById = async () => {
    await axios.get(`/api/groups/get/${groupId}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      setGroup(res.data);
      console.log(res.data);
    })

  }

  const scrolltobottom = () => {
    var myDiv = document.getElementById("myDiv");
    myDiv.scrollIntoView({ behavior: 'smooth' });
  }



  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("join", { userId: user._id, username: user.username }, () => {

    });

    socket.on("Output Group Chat Message", messageFromBackend => {
      setGetMessage(messageFromBackend);
      scrolltobottom();
    });

    return () => {
    }
  }, [ENDPOINT]);

  useEffect(() => {
    getGroupChat();
    getGroupById();
    scrolltobottom();
    return () => {

    }
  }, [groupId]);


  const submitChatHandler = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    let type = "Text";
    chatMessage &&
      await socket.emit("Input Group Chat Message", {
        message: chatMessage,
        userId: user._id,
        username: user.username,
        groupId,
        nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        type
      });
    setChatMessage("");
    scrolltobottom();
    setLoading(false);

  }

  const handleImageChange = (e) => {
    setFile(
      e.target.files[0]

    )
  }
  const UploadImage = () => {
    setLoading(true);
    let data = new FormData();
    data.append('file', file);
    let type = "VideoOrImage"
    axios.post('/api/chats/upload-image', data, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        socket.emit("Input Group Chat Message", {
          message: res.data.url,
          cloudinary_id: res.data.id,
          userId: user._id,
          username: user.username,
          groupId,
          nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
          type
        });

        setFile('');
        setLoading(false);
      }
    });
  }

  const deleteChatHandler = async (chatId, senderId) => {
    socket.emit("Delete Group Chat", { chatId: chatId, userId: senderId, groupId });
  }



  const handleEmojis = (value) => {
    setChatMessage(
      chatMessage + value.native
    )
  }
  return (
    <ChatLayout usersSide>


      <div style={{ position: 'relative' }}>
        <div className='header-avatar px-2' style={{ background: 'whitesmoke', position: 'fixed', width: '100%' }}>
          <Comment
            author={<h6 className='mt-1 pl-4'>{group.group}</h6>}
          />

        </div>
      </div>
      <div>
        <div style={{ overflowX: 'hidden', height: '67vh', overflowY: 'auto', marginTop: '223px' }}>
          {
            getMessage && getMessage.map(chat => {
              return (
                <>
                  <Comment className={chat.sender._id === user._id ? 'sender-chat' : 'w-50'}
                    author={<h6>{chat.sender.fullName}</h6>}
                    avatar={
                      <Avatar
                        src={chat.sender.image}
                        alt={chat.sender.username}
                      />
                    }
                    content={
                      chat.message.substring(0, 6) === "http:/" ?
                        chat.message.substring(chat.message.length - 3, chat.message.length) === "mp4" ?
                          chat.sender._id === user._id ?
                            <Popover content={<DeleteOutlined onClick={() => deleteChatHandler(chat._id, chat.sender)} />} title={false} trigger="click">
                              <video style={{ maxWidth: '200px' }} src={chat.message} controls alt='videos' type="video/mp4" />
                            </Popover>
                            :
                            <video style={{ maxWidth: '200px' }} src={chat.message} controls alt='videos' type="video/mp4" />


                          :
                          chat.sender._id === user._id ?
                            <Popover content={<DeleteOutlined onClick={() => deleteChatHandler(chat._id, chat.sender)} />} title={false} trigger="click">
                              <img src={chat.message} alt='images' style={{ maxWidth: '200px' }} />
                            </Popover>
                            :
                            <img src={chat.message} alt='images' style={{ maxWidth: '200px' }} />

                        :
                        chat.sender._id === user._id ?
                          <Popover content={<DeleteOutlined onClick={() => deleteChatHandler(chat._id, chat.sender)} />} title={false} trigger="click">
                            <Link className='text-dark'>
                              {chat.message}
                            </Link>
                          </Popover>
                          :
                          <p>
                            {chat.message}
                          </p>
                    }
                    datetime={
                      <span>
                        {
                          moment(chat.timeOfSending, 'dddd, MMMM Do YYYY, h:mm:ss a').fromNow()
                        }

                      </span>
                    }

                  />
                </>
              )
            })
          }
          <div id='myDiv'>
          </div>
        </div>
        <div className='p-2' style={{ position: 'sticky', bottom: '0px', background: 'lightgray' }}>
          {
            success && <Picker set='apple' skin='1' onSelect={handleEmojis} style={{ position: 'absolute', bottom: '20px', right: '20px' }} />

          }
          <div className='d-flex'>
            <Input suffix={<SmileOutlined onClick={() => setSuccess(!success)} />} style={file ? { width: '73%' } : { width: '82%' }} value={chatMessage} placeholder="Type message here..." allowClear onChange={onChange} />
            <input id="actual-btn" type="file" name='file' multiple onChange={handleImageChange} hidden />
            <label for="actual-btn" className='px-4'><Tooltip title='Choose File'><UploadOutlined style={{ fontSize: '23px', cursor: 'pointer' }} /></Tooltip></label>
            {
              file ?
                <Button type='primary' loading={loading} onClick={UploadImage}>{loading ? <span>Sending</span> : <span>Send File</span>}</Button>
                :
                <Button type='primary' loading={loading} onClick={submitChatHandler}><SendOutlined /></Button>

            }
          </div>
        </div>

      </div>
    </ChatLayout>

  )
}
