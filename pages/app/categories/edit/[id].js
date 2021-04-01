import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../../Container'
import Layout from '../../../../src/layouts'
import Widget from '../../../../src/components/widget'
import { Alert } from '../../../../src/components/alerts'
import Api from "../../../../src/api";
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import Select from 'react-select'
import LoadingModal from '../../../../src/components/modals/LoadingModal'
import ImageSelector from "../imageSelector"

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [categoryData, setCategoryData] = useState(null)
  const [alertType, setAlertType] = useState('red');
  const {register, handleSubmit, watch, errors, setValue, reset} = useForm({defaultValues: { id: 0, type_name: "", type_desc: "" }});
  const [imagesList, setImagesList] = useState([])
  const [defaultImagesList, setDefaultImagesList] = useState(null)
  const [categoryID, setCategoryID] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getCategoryDetails(id);
    }else{
      setLoadingData(false);
      setCategoryData(null);
      setMessages("عفوا : رقم التصنيف غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم التصنيف غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _getCategoryDetails = ( category_id ) => {
      Api.Categories.details(category_id).then((res)=>{
        console.log("res", res);
        setLoadingData(false);
        if(res.statusCode === 200){
          const categoryDetails = res.data?.data;
          setCategoryData(categoryDetails[0]);
        }else{
          setCategoryData(null);
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات التصنيف", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(categoryData){
      let categoryCurrentData = {
        id: categoryData.id,
        type_name: categoryData.type_name,
        type_desc: categoryData.type_desc
      };
      reset(categoryCurrentData);
      // setValue(categoryCurrentData);
      setDefaultImagesList(categoryData.Image_path);
    }
  }, [categoryData])

  const _updateCategory = data => {
    Api.Categories.update(data).then((res)=>{
      setLoadingData(false);
      if(res.statusCode === 202){
        NotificationManager.success('تم تحديث بيانات التصنيف', 'نجاح', 3000);
        setTimeout(()=>{
          router.push('/app/categories');
        }, 200);
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات التصنيف', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      id: categoryData.id,
      type_name: fields.type_name,
      type_desc: fields.type_desc
    }
    if(imagesList[0]){
      data.Image_path = imagesList[0];
    }else{
      data.Image_path = categoryData.Image_path;
    }

    console.log("fields", data);
    _updateCategory(data);
  }

  return (
    <Container>
      { loadingData ? ( 
        <Layout>
          <LoadingModal />
        </Layout>
      ) : (
        <Layout>
          { categoryData === null ? (
            <div className="flex justify-center w-11/12 content-center" style={{paddingTop:200}} > 
              <div className="w-15 h-20 text-center text-xl text-gray-800 bg-white">
                  {messages &&
                    <Alert color="red" closeable={true} type="warning" raised flat >
                      {messages}
                    </Alert>
                  }
              </div>
            </div>
          ) : (
            <div>
            <Widget className="relative" title="تعديل بيانات التصنيف" description={""} >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="text-sm mb-4 w-full"
                  autoComplete="off"
                  defaultValue  
                >
                <div className="customActLinks">
                  <div
                      className="px-10 py-3 mt-1 uppercase font-bold text-white bg-gray-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-left mr-2"
                      onClick={()=> router.back() }
                  >إلغاء</div>
                  <input
                      type="submit"
                      className="px-6 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-full cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none float-left ml-2"
                      value="حفظ"
                  />
                </div>
                  <Widget title="" className="mt-10 bg-gray-100 w-10/12" >
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
                      <br></br>
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
