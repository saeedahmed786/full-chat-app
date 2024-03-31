import React, { useState } from 'react';
import { Input } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setAuthentication } from '../../components/auth/auth';
import { Error, Success } from '../../components/messages/messages';
import Loading from '../../components/loading/Loading';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',

  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/login', { email, password }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        Success(res.data.successMessage);
        props.history.push('/');
        document.location.reload();
      }
      else {
        Error(res.data.errorMessage);
      }
    }).catch(err => {
      Error(err?.message)
    })

  };


  return (

    <div>
      {
        loading
          ?
          <Loading />
          :
          <>
            <div className='auth-form'>
              <div className='auth-form-inner'>
                <div style={{ padding: '60px' }}>
                  <div className='login-right text-center'>
                    <div>
                      <p className='mb-2' style={{ fontSize: '20px', fontWeight: '680', color: '#424553' }}>Welcome!</p>
                      <form onSubmit={onFinish}>
                        <div className="floating-label-group mb-3">
                          <Input name='email' onChange={handleChange} size='small' placeholder="Email or Username" prefix={<UserOutlined />} />
                        </div>
                        <div className="floating-label-group">
                          <Input.Password name='password' type='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                        </div>
                        <div className='d-flex justify-content-between mt-2'>
                          <div>
                            <label className="form-check-label float-left mt-1 ml-2">
                              <input className="form-check-input" type="checkbox" /> Remember
                            </label>
                          </div>
                          <div>
                            <Link className='pass' to='/reset-password'>Lost Password?</Link>
                          </div>
                        </div>
                        <button type='submit' className='btn my-2 mt-3 w-100' style={{ padding: '10px', background: 'rgba(130, 36, 227, 0.8)', color: 'white', borderRadius: '23px' }}>
                          Login
                        </button>
                      </form>
                      <div className='mt-2'>
                        <p>
                          New to <strong>Website?</strong> <Link to='/signup' style={{ color: 'rgba(130, 36, 227, 0.8)', fontWeight: '631' }}>Register</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
      }
    </div>

  );
}
