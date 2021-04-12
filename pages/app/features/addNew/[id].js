import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../../Container'
import Layout from '../../../../src/layouts'
import Widget from '../../../../src/components/widget'
import Api from "../../../../src/api";
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import ImageSelector from "../imageSelector"
import LoadingModal from '../../../../src/components/modals/LoadingModal'

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
  const { id } = router.query;

  const _createFeature = data => {
    Api.Features.create(data).then((res)=>{
      setLoadingData(false);
      NotificationManager.success('تم اضافة الميزة ', 'نجاح', 3000);
      router.push('/app/features/'+id);
    });
  }

  const onSubmit = fields => {
    if(imagesList?.length){
      setLoadingData(true);
      let data = {
        name: fields.name,
        description: fields.description,
        cat_id: id,
        images: imagesList
      }
      var formData = new FormData();
      formData.append("cat_id", data.cat_id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("images", data.images[0]);
      _createFeature(formData);
    }else{
      NotificationManager.error("الرجاء إضافة صورة", 'عفواً', 3000);
    }
  }

  return (
    <Container>
        <Layout>
          { loadingData ? (
            <LoadingModal />
          ): null}

          <div>
          <Widget title="اضافة ميزة جديدة" description={""} >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-sm mb-4 w-full"
                autoComplete="off"
                defaultValue
              >
                <Widget title="" className="bg-gray-100 w-10/12" >
                  <div className="flex-col w-4/12 mb-4 ml-6 float-right">
                      <div className="w-full mb-12 p-5 bg-white border-2 border-gray-200 float-right ml-6">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الاسم</span>
                          <input
                            name="name"
                            type="text"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="ادخل الاسم"
                          />
                        </label>
                      </div>
                      <div className="w-full mb-12 p-5 bg-white border-2 border-gray-200 float-right">
                        <label className="block">
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>الوصف</span>
                          <input
                            name="description"
                            type="text"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                            placeholder="ادخل الوصف"
                          />
                        </label>
                      </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="w-3/12 mb-12 p-5 bg-white border-2 border-gray-200">
                    <label className="block">
                      <span className="text-default mb-2 block">الصورة</span>
                    </label>
                    <div className="form-group multi-preview addNewImageCont" >
                      {defaultImagesList !== null ? (
                        <div className="border-8 border-transparent rounded shadow-sm w-5/5 h-48 imagecontainer relative">
                            <img src={defaultImagesList} className="" alt="..." />
                            <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=> setDefaultImagesList(null) } />
                        </div>
                      ):(
                        <div className="border-8 border-transparent rounded shadow-sm w-5/5 h-48 imagecontainer relative">
                          <ImageSelector uploadImages={setImagesList} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full clear-both">
                    <input
                      type="submit"
                      className="px-10 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-full cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none"
                      value="إضافة"
                    />
                    <div
                        className="px-10 py-3 mt-1 uppercase font-bold text-white bg-gray-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-right ml-2"
                        onClick={()=> router.back() }
                    >إلغاء</div>
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
