import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../src/components/alerts'
import { wrapper } from '../../../src/store'
import { connect } from "react-redux"
import Api from '../../api'
import { authenticate, checkServerSideCookie } from "../../actions/authActions"

const Login1 = ({ authenticate, token }) => {
  const [messages, setMessages] = useState(false)
  const {register, handleSubmit, watch, errors} = useForm()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      router.push('/dashboards');
    }
  });

  const onSubmit = data => {
    Api.Auth.login(data).then((res)=>{
      if(res.statusCode === 200){
        authenticate(res.data);
        router.push('/dashboards');
      }else{
        setMessages(res.statusName);
        setTimeout(() => {
          setMessages(false);
        }, 3000);
      }
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4 w-4/6">
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">البريد الإلكتروني</span>
            <input
              name="email"
              type="email"
              ref={register({required: true})}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="ادخل البريد الإلكتروني"
            />
          </label>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">البريد الإلكتروني اجباري</p>
          )}
        </div>
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">كلمة المرور</span>
            <input
              name="password"
              type="password"
              ref={register({required: true})}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="ادخل كلمة المرور"
            />
          </label>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">كلمة المرور اجبارية</p>
          )}
        </div>

        <div className="w-full">
          {messages && (
            <Alert color="red" raised flat >
              {messages}
            </Alert>
          )}
          <input
            type="submit"
            className="px-4 py-3 mt-4 uppercase font-bold text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:outline-none active:outline-none cursor-pointer"
            value="تسجيل الدخول"
          />
        </div>
      </form>

    </>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    checkServerSideCookie(context);
    const token = context.store.getState().authentication.token;
    return { props: { token } };
  }
);

export default connect((state) => state, { authenticate })(Login1);
