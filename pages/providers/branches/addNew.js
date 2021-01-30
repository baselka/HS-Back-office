import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Select from 'react-select'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [modal, setModal] = useState(false)
  const [branches, setBranches] = useState(['1'])
  const [providerID, setProviderID] = useState(null)
  const [alertType, setAlertType] = useState('red')
  const [providerType, setProviderType] = useState({label:'-- إختر نوع مقدم الخدمة --',value:"null"})
  const [providersList, setProvidersList] = useState([{label:'مقدم خدمة تجريبي',value:"1"}])
  const [providerTypeOpts, setProviderTypeOpts] = useState([{label:'-- إختر نوع مقدم الخدمة --',value:"null"},{label:'مقدم خدمة مسجل مسبقا',value:'Registered'},{label:'مقدم خدمة جديد',value:'New'}]);
  const {register, handleSubmit, watch, errors} = useForm()
  const router = useRouter();

  useEffect(() => {
    console.log('providerType', providerType);
    if(providerType.value === "Registered"){
      _getProvidersList();
    }
  }, [providerType])
  
  const _getProvidersList = () => {
    let data = {
      start: 0,
      end: 1000
    }
    Api.Providers.all(data).then((res)=>{
      console.log('_getProvidersList', res);
      if(res.statusCode === 200){
        let plist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          plist.push({label:element.full_name, value:element.provider_id});
        }
        setProvidersList(plist);
      }
    });
  }

  const _setProviderID = fields => {
    console.log('_setProviderID', fields);
    setProviderID(fields.value)
  }

  const _createNewBranch = data => {
    console.log('_createNewBranch', data);
    Api.Branches.create(data).then((res)=>{
      console.log('_createNewBranch res', res);
      if(res.statusCode === 200){
        NotificationManager.success('تم إضافة فرع '+ data.branch_name +' بنجاح ', 'نجاح', 3000);
        router.push('/providers/branches');
      }else{
        NotificationManager.error('حدث خطأ اثناء إضافة الفرع', 'عفواً', 3000);
      }
    });
  }

  const _createNewProvider = fields => {
    console.log('_createNewProvider', fields);

    let data = {
      full_name: fields.provider_name,
      email: fields.provider_email,
      pwd: fields.provider_pwd,
      phone: fields.provider_phone,
    };

    Api.Providers.create(data).then((res)=>{
      console.log('_createNewProvider res', res);
      if(res.statusCode === 200){
        let data = {
          branch_name: fields.branch_name,
          branch_desc: fields.branch_desc,
          provider_id: res.data.id, ///// provider_id
          whats: fields.whats,
          twitter: fields.twitter,
          facebook: fields.facebook,
          snapchat: fields.snapchat,
          insta: fields.insta,
          telephone: fields.telephone,
          city_id: fields.city_id,
          category_id: fields.category_id,
          email: fields.email,
          sub_cat_id: fields.sub_cat_id
        }
        _createNewBranch(data);
      }else{
        NotificationManager.error('حدث خطأ اثناء إضافة مقدم الخدمة', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    console.log('onSubmit', fields);
    if(providerTypeOpts === "Registered"){
      let data = {
        branch_name: fields.branch_name,
        branch_desc: fields.branch_desc,
        provider_id: fields.provider_id,
        whats: fields.whats,
        twitter: fields.twitter,
        facebook: fields.facebook,
        snapchat: fields.snapchat,
        insta: fields.insta,
        telephone: fields.telephone,
        city_id: fields.city_id,
        category_id: fields.category_id,
        email: fields.email,
        sub_cat_id: fields.sub_cat_id
      }
      _createNewBranch(data);
    } else if(providerTypeOpts === "New"){
      _createNewProvider(fields)
    } else {
      NotificationManager.error('الرجاء إختيار ما إذا كان مقدم الخدمة مسجلا مسبقاً ام لا', 'عفواً', 3000);
    }
  }

  return (
    <Container>
      <Layout>
        { branches.length === 0 ? (
          <div className="flex justify-center w-11/12 h-screen content-center" style={{paddingTop:200}} > 
            <div className="w-15 h-20 text-center text-xl text-gray-800">
              <Icon.Loader size={30} className="m-auto" />
              ... loading ...
            </div>
          </div>
        ) : (
          <div>
            <Widget title="إضافة فرع جديد" description={<span><br />الرجاء تعبئة البيانات التالية:<br /><br /><hr /><br /></span>}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="text-sm mb-4 w-full">
                  
                  <div className="w-4/12 mb-12 p-5 bg-gray-100 border-2 border-gray-200">
                    <label className="block">
                      <span className="text-default">نوع مقدم الخدمة</span>
                      <Select name="provider_type" options={providerTypeOpts} className="w-full mt-3" placeholder={"-- إختر نوع مقدم الخدمة --"} onChange={setProviderType} />
                    </label>
                  </div>

                  {(providerType.value !== "null") ? (
                    <>
                      {(providerType.value === "New") ? (            
                          <Widget title="" className="bg-gray-100 w-10/12" description={<span>الرجاء تعبئة بيانات مقدم الخدمة ادناه: </span>}>
                              <div className="flex flex-row w-11/12 mb-4 ml-6">
                                  <div className="w-3/12 mb-0 ml-2 p-5 bg-white border-2 border-gray-200">
                                    <label className="block">
                                      <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم مقدم الخدمة</span>
                                      <input
                                        name="provider_name"
                                        type="text"
                                        ref={register({required: false})}
                                        className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                                        placeholder="ادخل اسم مقدم الخدمة"
                                      />
                                    </label>
                                  </div>
                                  <div className="w-3/12 mb-0 ml-2 p-5 bg-white border-2 border-gray-200">
                                    <label className="block">
                                      <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>البريد الإلكتروني لمقدم الخدمة</span>
                                      <input
                                        name="provider_email"
                                        type="email"
                                        ref={register({required: false})}
                                        className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                        placeholder="ادخل البريد الإلكتروني لمقدم الخدمة"
                                      />
                                    </label>
                                </div>
                                <div className="w-3/12 mb-0 ml-2 p-5 bg-white border-2 border-gray-200">
                                  <label className="block">
                                    <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>رقم جوال مقدم الخدمة</span>
                                    <input
                                      name="provider_phone"
                                      type="number"
                                      ref={register({required: false})}
                                      className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                      placeholder="ادخل رقم جوال مقدم الخدمة"
                                    />
                                  </label>
                                </div>
                                <div className="w-3/12 mb-0 ml-2 p-5 bg-white border-2 border-gray-200">
                                  <label className="block">
                                    <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>كلمة مرور مقدم الخدمة</span>
                                    <input
                                      name="provider_pwd"
                                      type="password"
                                      ref={register({required: false})}
                                      className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                      placeholder="ادخل كلمة مرور مقدم الخدمة"
                                    />
                                  </label>
                                </div>

                            </div>
                        </Widget>
                      ):null}
            
                      <Widget title="" className="bg-gray-100 w-10/12" description={<span>الرجاء تعبئة بيانات الفرع ادناه: </span>}>
                          <div className="flex-col w-96 mb-4 ml-6 float-right">
                              {(providerType.value === "Registered") ? (
                                <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                  <label className="block">
                                    <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>إختر مقدم الخدمة</span>
                                    <Select name="provider_id" options={providersList} className="w-full mt-2" placeholder={"-- إختر مقدم الخدمة --"}onChange={_setProviderID} />
                                  </label>
                                </div>
                              ):null}
                              <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                <label className="block">
                                  <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم الفرع</span>
                                  <input
                                    name="branch_name"
                                    type="text"
                                    ref={register({required: false})}
                                    className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                                    placeholder="ادخل اسم الفرع"
                                  />
                                </label>
                              </div>
                              <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                <label className="block">
                                  <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>المدينة</span>
                                  <input
                                    name="city_id"
                                    type="number"
                                    ref={register({required: false})}
                                    className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                    placeholder="اختر المدينة"
                                  />
                                </label>
                              </div>
                              <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                <label className="block">
                                  <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>البريد الإلكتروني</span>
                                  <input
                                    name="email"
                                    type="email"
                                    ref={register({required: false})}
                                    className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                    placeholder="ادخل البريد الإلكتروني"
                                  />
                                </label>
                            </div>
                          </div>
                          <div className="flex-col w-96 mb-4 ml-6 float-right">
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                <label className="block">
                                  <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الرئيسي</span>
                                  <input
                                    name="category_id"
                                    type="number"
                                    ref={register({required: false})}
                                    className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                    placeholder="اختر التصنيف الرئيسي"
                                  />
                                </label>
                              </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                                <label className="block">
                                  <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الفرعي</span>
                                  <input
                                    name="sub_cat_id"
                                    type="number"
                                    ref={register({required: false})}
                                    className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                    placeholder="اختر التصنيف الفرعي"
                                  />
                                </label>
                              </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">رقم الجوال</span>
                                <input
                                  name="telephone"
                                  type="number"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل رقم الجوال"
                                />
                              </label>
                            </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">رقم الواتس</span>
                                <input
                                  name="whats"
                                  type="number"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل رقم الواتس"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex-col w-96 mb-4 ml-6 float-right">
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">حساب تويتر</span>
                                <input
                                  name="twitter"
                                  type="text"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل حساب تويتر"
                                />
                              </label>
                            </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">حساب فيسبوك</span>
                                <input
                                  name="facebook"
                                  type="text"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل حساب فيسبوك"
                                />
                              </label>
                            </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">حساب سناب شات</span>
                                <input
                                  name="snapchat"
                                  type="text"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل حساب سناب شات"
                                />
                              </label>
                            </div>
                            <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">حساب انستغرام</span>
                                <input
                                  name="insta"
                                  type="text"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="ادخل حساب انستغرام"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex-col w-full mb-4 ml-6 float-right">
                            <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                              <label className="block">
                                <span className="text-default">معلومات عن الفرع</span>
                                <textarea
                                  name="branch_desc"
                                  className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                  placeholder="اكتب معلومات عن الفرع"
                                  style={{minHeight:110}}
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
                              value="إضافة الفرع"
                            />
                        </div>
                      </Widget>
                  </>
                ):null}
              </form>
          </Widget>
          </div>
        )}
      </Layout>
    </Container>
  )
}

export default Index
