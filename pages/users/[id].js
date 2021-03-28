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

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [userData, setUserData] = useState(null)
  const [imagesList, setImagesList] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [accountTypes, setAccountTypes] = useState([{label:"مدير لوحة التحكم", value:1},{label:"ممثل خدمة العملاء",value:2}]);
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [userID, setUserID] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getUserDetails(id);
    }else{
      setLoadingData(false);
      setUserData(null);
      setMessages("عفوا : رقم المستخدم غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم المستخدم غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _getUserDetails = ( user_id ) => {
      Api.Users.details(user_id).then((res)=>{
        console.log("res", res);
        setLoadingData(false);
        if(res.statusCode === 200){
          const userDetails = res.data?.data;
          setUserData(userDetails[0]);
        }else{
          setUserData(null);
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات المستخدم", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(userData){
      let userCurrentData = [
        { id: userData.id },
        { username: userData.username },
        { full_name: userData.full_name },
        { email: userData.email },
        { phone: userData.phone },
        { acc_type: userData.acc_type }
      ];
      if(userData.acc_type === 1){
        setUserID({label:"مدير لوحة التحكم", value:1});
      }else{
        setUserID({label:"ممثل خدمة العملاء",value:2});
      }
      setValue(userCurrentData);
    }
  }, [userData])

  const _updateUser = data => {
    Api.Users.update(data).then((res)=>{
      setLoadingData(false);
      if(res.statusCode === 200){
        NotificationManager.success('تم تحديث بيانات المستخدم', 'نجاح', 3000);
        setTimeout(()=>{
          router.push('/users');
        }, 200);
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات المستخدم', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      id: userData.id,
      full_name: fields.full_name,
      username: fields.username,
      email: fields.email,
      phone: fields.phone,
      acc_type: userID.value
    }
    if(fields.pwd) data.pwd = pwd;
    _updateUser(data);
  }

  return (
    <Container>
      { loadingData ? ( 
        <Layout>
          <LoadingModal />
        </Layout>
      ) : (
        <Layout>
          { userData === null ? (
            <div className="flex justify-center w-11/12 content-center" style={{paddingTop:200}} > 
              <div className="w-15 h-20 text-center text-xl text-gray-800 bg-white ">
                  {messages &&
                    <Alert color="red" closeable={true} type="warning" raised flat >
                      {messages}
                    </Alert>
                  }
              </div>
            </div>
          ) : (
            <div>
            <Widget title="تعديل بيانات المستخدم" description={""}>
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
                    </div>
                    <div className="flex-col w-96 mb-4 ml-6 float-right">
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>نوع الحساب</span>
                          {userID &&
                            <Select name="acc_type" options={accountTypes} className="w-full mt-2" placeholder={"-- إختر نوع المستخدم --"} onChange={(data)=> {setUserID(data)}} defaultValue={userID} />
                          }
                        </label>
                      </div>
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
                          <span className="text-default">كلمة المرور</span>
                          <input
                            name="pwd"
                            type="password"
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="كلمة المرور"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="w-full clear-both">
                      {messages && (
                        <div className={"bg-white"} >
                          <Alert color="red" raised flat >
                            {messages}
                          </Alert>
                        </div>
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
          )}
        </Layout>
      )}
    </Container>
  )
}

export default Index
