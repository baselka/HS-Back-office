import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Api from "../../../src/api";
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import Select from 'react-select'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import ImageSelector from "./imageSelector"

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [categoryData, setCategoryData] = useState(null)
  const [alertType, setAlertType] = useState('red');
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const [imagesList, setImagesList] = useState([])
  const [defaultImagesList, setDefaultImagesList] = useState(null)
  const [categoryID, setCategoryID] = useState(null);
  const router = useRouter();

  const _createCategory = data => {
    Api.Categories.create(data).then((res)=>{
      console.log("create", res);
      setLoadingData(false);
      // if(res.status === "success"){
        NotificationManager.success('تم اضافة التصنيف', 'نجاح', 3000);
        // setTimeout(()=>{
          router.push('/app/categories');
        // }, 200);
      // }else{
        // NotificationManager.error('حدث خطأ اثناء اضافة التصنيف', 'عفواً', 3000);
      // }
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      type_name: fields.type_name,
      type_desc: fields.type_desc,
      images: imagesList
    }

    console.log("fields", data);
    _createCategory(data);
  }

  return (
    <Container>
        <Layout>
          { loadingData ? (
            <LoadingModal />
          ): null}

          <div>
          <Widget title="اضافة تصنيف" description={""} >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-sm mb-4 w-full"
                autoComplete="off"
                defaultValue
              >
                <Widget title="" className="bg-gray-100 w-10/12" >
                  <div className="flex-col w-6/12 mb-4 ml-6 float-right">
                      <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الاسم التصنيف</span>
                          <input
                            name="type_name"
                            type="text"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="ادخل الاسم"
                          />
                        </label>
                      </div>
                      <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default">وصف التصنيف</span>
                          <textarea
                            name="type_desc"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white mt-2"
                            placeholder="ادخل وصف التصنيف"
                            style={{minHeight:110}}
                          />
                        </label>
                      </div>
                      <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default mb-2 block">صورة التصنيف</span>
                        </label>
                        
                        <div className="form-group multi-preview addNewImageCont" >
                          {defaultImagesList !== null ? (
                            <div className="border-8 border-transparent rounded shadow-sm w-2/5 h-48 imagecontainer relative">
                                <img src={defaultImagesList} className="" alt="..." />
                                <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=> setDefaultImagesList(null) } />
                            </div>
                          ):(
                            <div className="border-8 border-transparent rounded shadow-sm w-2/5 h-48 imagecontainer relative">
                              <ImageSelector uploadImages={setImagesList} />
                            </div>
                          )}
                        </div>
                        <div className={"clearfix"} ></div>
                      </div>
                  </div>

                  <div className="w-full clear-both">
                    <input
                      type="submit"
                      className="px-4 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-lg cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none"
                      value="إضافة"
                    />
                </div>
              </Widget>
            </form>
          </Widget>
          </div>
          
        </Layout>
    </Container>
  )
}

export default Index
