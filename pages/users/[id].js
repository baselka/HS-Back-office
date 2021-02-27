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
  const [loadingData, setLoadingData] = useState(true)
  const [userData, setUserData] = useState(null)
  const [imagesList, setImagesList] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [accountTypes, setAccountTypes] = useState([{label:"مدير لوحة التحكم", value:1},{label:"ممثل خدمة العملاء",value:2}])
  const [selectedUser, setSelectedUser] = useState()
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [userID, setUserID] = useState(null)
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log('router.query', router);
    console.log('userData id', id);
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
        console.log('_getUserDetails', res);
        setLoadingData(false);
        if(res.statusCode === 200){
          const userDetails = res.data?.data;
          console.log("userDetails", userDetails);
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
        { email: userData.email },
        { phone: userData.phone },
        { acc_type: userData.acc_type }
      ];
      console.log('userCurrentData', userCurrentData);
      setTimeout(() => {
        setValue(userCurrentData);
        if(userData.acc_type === 1){
          setSelectedUser({label:"مدير لوحة التحكم", value:1});
          setUserID(1);
        }else{
          setSelectedUser({label:"ممثل خدمة العملاء",value:2});
          setUserID(2);
        }
      }, 500);
    }
  }, [userData])

  const _updateUser = data => {
    console.log('_updateUser', data);
    Api.Users.update(data).then((res)=>{
      console.log('_updateUser res', res);
      if(res.statusCode === 200){
        NotificationManager.success('تم تحديث بيانات المستخدم بنجاح ', 'نجاح', 3000);
        if(imagesList && imagesList.length > 0){
          _uploadUserImages(id);
        }else{
          NotificationManager.success('تم تحديث بيانات المستخدم بنجاح ', 'نجاح', 3000);
          setTimeout(() => {
            setLoadingData(false);
            router.push('/users');
          }, 1000);
        }
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات المستخدم', 'عفواً', 3000);
        setLoadingData(false);
        router.push('/users');
      }
    });
  }

  const onSubmit = fields => {
    console.log('fields', fields);
    setLoadingData(true);
    let data = {
      ...fields,
      id: userID
    }
    _updateUser(data);
  }

  const _setUserID = fields => {
    console.log('_setUserID', fields);
    setUserID(fields.value)
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
              <div className="w-15 h-20 text-center text-xl text-gray-800">
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
                    defaultValue  
                  >
                    <Widget title="" className="bg-gray-100 w-10/12" >
                      <div className="flex-col w-96 mb-4 ml-6 float-right">
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الاسم</span>
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
                            <span className="text-default">نوع الحساب</span>
                            <Select name="acc_type" options={accountTypes} className="w-full mt-2" placeholder={"-- إختر نوع المستخدم --"} onChange={(data)=> { _setUserID(data); setSelectedUser(data)}} defaultValue={userID} />
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
                            <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الاسم</span>
                            <input
                              name="username"
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
          )}
        </Layout>
      )}
    </Container>
  )
}

export default Index
