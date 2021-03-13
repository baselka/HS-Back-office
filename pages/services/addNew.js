import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import { useForm } from 'react-hook-form'

import Widget from '../../src/components/widget'
import { Alert } from '../../src/components/alerts'
import Select from 'react-select'
import Api from '../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Modal from '../../src/components/modals'
import ImageSelector from "../providers/branches/imageSelector"

const Index = () => {
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [serviceImages, setServiceImages] = useState([])
  const [imagesList, setImagesList] = useState([])

  const onSubmit = fields => {
    setLoadingData(true);
  }

  return (
    <Container>
      { loadingData &&
        <Layout>
          <LoadingModal />
        </Layout>
      }
      <Layout>
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
                        <span className="text-default">السعر</span>
                        <input
                          name="price"
                          type="number"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white mt-2"
                          placeholder="ادخل السعر"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex-col w-96 mb-4 ml-6 float-right">
                    <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                      <label className="block">
                        <span className="text-default">الحالة</span>
                        <input
                          name="status"
                          type="number"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white mt-2"
                          placeholder="ادخل الحالة"
                        />
                      </label>
                    </div>
                    <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                      <label className="block">
                        <span className="text-default">نوع الحجز</span>
                        <input
                          name="reservation_type"
                          type="number"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white mt-2"
                          placeholder="ادخل الحالة"
                        />
                      </label>
                    </div>
                    <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                      <label className="block">
                        <span className="text-default">برومو</span>
                        <input
                          name="promo"
                          type="number"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white mt-2"
                          placeholder="ادخل الحالة"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex-col w-7/12 mb-4 ml-6 float-right">
                    <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                      <label className="block">
                        <span className="text-default">الوصف</span>
                        <textarea
                          name="ser_desc"
                          ref={register({required: true})}
                          className="form-input mt-1 text-xs block w-full bg-white mt-2"
                          placeholder="اكتب معلومات عن الخدمة"
                          style={{minHeight:110}}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex-col w-full mb-2 ml-6 float-right">
                    <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                      <label className="block">
                        <span className="text-default mb-2 block">صور الخدمة</span>
                      </label>
                      
                      <div className="form-group multi-preview addNewImageCont" >
                          {serviceImages.map((imag, index) => (
                              <div key={index} className="float-right m-0 mb-5 border-8 border-transparent rounded shadow-sm w-1/5 h-48 imagecontainer relative">
                                  <img src={imag.image} className="" alt="..." />
                                  <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=>_removeServiceImage(imag.id)} />
                              </div>
                          ))}
                      </div>
                      <ImageSelector uploadImages={setImagesList} />
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
      </Layout>
    </Container>
  )
}

export default Index
