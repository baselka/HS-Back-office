import React, { useState, useEffect } from 'react'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'
import { useForm } from 'react-hook-form'

import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Select from 'react-select'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Modal from '../../../src/components/modals'
import ImageSelector from "../../providers/branches/imageSelector"

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Index = () => {
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [serviceImages, setServiceImages] = useState([])
  const [imagesList, setImagesList] = useState([])
  const router = useRouter();
  const { id } = router.query;

  const _createService = data => {
    Api.Services.create(data).then((res)=>{
      if(res.statusCode === 201){
        NotificationManager.success('تم إضافة بيانات الخدمة', 'نجاح', 3000);
        if(imagesList && imagesList.length > 0){
          let imgData = { id: res.data.id, images: imagesList };
          Api.Services.uploadServiceImages({data:imgData}).then((res)=>{
            setLoadingData(false);
            if(res.statusCode === 201){
              NotificationManager.success('تم إضافة صور الخدمة', 'نجاح', 3000);
            }else{
              NotificationManager.error('حدث خطأ اثناء إضافة صور الخدمة', 'عفواً', 3000);
            }
          });
        }else{
          setLoadingData(false);
        }
      }else{
        setLoadingData(false);
        NotificationManager.error('حدث خطأ اثناء إضافة بيانات الخدمة', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      name: fields.name,
      branch_id: id,
      ser_desc: fields.ser_desc,
      price: fields.price,
    }
    _createService(data);
  }

  return (
    <Container>
      <Layout>
      { loadingData &&
        <LoadingModal />
      }
      < SectionTitle subtitle="إضافة خدمة جديدة" title="إدارة الخدمات" />
          <Widget title="ادخل بيانات الخدمة ادناه" description={""}>
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
                        <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم الخدمة</span>
                        <input
                          name="name"
                          type="text"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                          placeholder="ادخل اسم الخدمة"
                        />
                      </label>
                    </div>
                  <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                    <label className="block">
                      <span className="text-default">السعر</span>
                      <input
                        name="price"
                        type="number"
                        ref={register({required: false})}
                        className="form-input mt-1 text-xs block w-full bg-white mt-2"
                        placeholder="ادخل السعر"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex-col w-8/12 mb-4 ml-6 float-right">
                  <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                    <label className="block">
                      <span className="text-default">الوصف</span>
                      <textarea
                        name="ser_desc"
                        ref={register({required: false})}
                        className="form-input mt-1 text-xs block w-full bg-white mt-2"
                        placeholder="اكتب معلومات عن الخدمة"
                        style={{minHeight:169}}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-col w-full mb-2 ml-6 float-right">
                  <div className="w-12/12 mb-12 p-5 bg-white border-2 border-gray-200" style={{maxWidth:"97.2%"}} >
                    <label className="block">
                      <span className="text-default mb-2 block">صور الخدمة</span>
                    </label>
                    
                    <div className="form-group multi-preview addNewImageCont" >
                        {serviceImages.map((imag, index) => (
                            <div key={index} className="float-right m-0 mb-5 border-8 border-transparent rounded shadow-sm w-1/5 h-48 imagecontainer relative">
                                <img src={imag.img_path} className="" alt="..." />
                                <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=>_removeServiceImage(imag.img_id)} />
                            </div>
                        ))}
                    </div>
                    <ImageSelector uploadImages={setImagesList} />
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
                    value="إضافة"
                  />
              </div>
            </Widget>
            </form>
          </Widget>
      </Layout>
    </Container>
  )
}

export default Index
