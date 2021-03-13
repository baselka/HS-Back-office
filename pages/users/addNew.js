import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../Container'
import Layout from '../../src/layouts'
import Widget from '../../src/components/widget'
import { Alert } from '../../src/components/alerts'
import Api from '../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import Select from 'react-select'
import LoadingModal from '../../src/components/modals/LoadingModal'

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [userData, setUserData] = useState(null)
  const [imagesList, setImagesList] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [accountTypes, setAccountTypes] = useState([{label:"مدير لوحة التحكم", value:1},{label:"ممثل خدمة العملاء",value:2}]);
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [userID, setUserID] = useState(null);
  const router = useRouter();

  const _addUser = data => {
    Api.Users.create(data).then((res)=>{
      setLoadingData(false);
      if(res.statusCode === 201){
        NotificationManager.success('تم اضافة المستخدم', 'نجاح', 3000);
        setTimeout(()=>{
          router.push('/users');
        }, 200);
      }else{
        NotificationManager.error('حدث خطأ اثناء اضافة المستخدم', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    let errorList = [];
    if(!userID.value){
      errorList.push("الرجاء إختيار نوع الحساب");
    }
    if(!fields.full_name){
      errorList.push("الرجاء كتابة الاسم كاملا");
    }
    if(!fields.username){
      errorList.push("الرجاء كتابة اسم المستخدم");
    }
    if(!fields.email){
      errorList.push("الرجاء كتابة البريد الالكتروني");
    }
    if(!fields.pwd){
      errorList.push("الرجاء كتابة كلمة المرور");
    }
    if(!fields.pwdcnfrm){
      errorList.push("الرجاء كتابة تأكيد كلمة المرور");
    }
    if(fields.pwd !== fields.pwdcnfrm){
      errorList.push("كلمة المرور غير متطابقة");
    }
    if(errorList.length > 0){
      NotificationManager.error(errorList.join(", \n"), 'عفواً', 3000);
    }else{
      setLoadingData(true);
      let data = {
        full_name: fields.full_name,
        username: fields.username,
        email: fields.email,
        phone: fields.phone,
        acc_type: userID.value,
        pwd: fields.pwd,
        status: 2,
        retries: 0,
      }
      _addUser(data);
    }
  }

  return (
    <Container>
      { loadingData ? ( 
        <Layout>
          <LoadingModal />
        </Layout>
      ) : (
        <Layout>
            <div>
            <Widget title="إضافة مستخدم جديد" description={""}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="text-sm mb-4 w-full"
                  autoComplete="off"
                  defaultValue  
                >
                  <Widget title="" className="bg-gray-100 w-10/12" >
                    <div className="flex-col w-96 mb-4 ml-6 float-right">
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الاسم كامل</span>
                            <input
                              name="full_name"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                              placeholder="ادخل الاسم كاملا"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم المستخدم</span>
                            <input
                              name="username"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                              placeholder="ادخل اسم المستخدم"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>البريد الإلكتروني</span>
                            <input
                              name="email"
                              type="email"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل البريد الإلكتروني"
                            />
                          </label>
                      </div>
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>نوع الحساب</span>
                          <Select name="acc_type" options={accountTypes} className="w-full mt-2" placeholder={"-- إختر نوع المستخدم --"} onChange={(data)=> {setUserID(data)}} />
                        </label>
                      </div>
                    </div>
                    <div className="flex-col w-96 mb-4 ml-6 float-right">
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default">رقم الجوال</span>
                          <input
                            name="phone"
                            type="number"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white mt-2"
                            placeholder="ادخل رقم الجوال"
                          />
                        </label>
                      </div>
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>كلمة المرور</span>
                          <input
                            name="pwd"
                            type="password"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="كلمة المرور"
                          />
                        </label>
                      </div>
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>تأكيد كلمة المرور</span>
                          <input
                            name="pwdcnfrm"
                            type="password"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="كلمة المرور"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="w-full clear-both">
                      {messages && (
                        <Alert color="red" raised flat >
                          {messages}
                        </Alert>
                      )}
                      <input
                        type="submit"
                        className="px-4 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-lg cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none"
                        value="حفظ"
                      />
                  </div>
                </Widget>
              </form>
            </Widget>
            </div>
        </Layout>
      )}
    </Container>
  )
}

export default Index
