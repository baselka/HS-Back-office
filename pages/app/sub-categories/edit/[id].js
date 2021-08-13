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
  const {register, handleSubmit, watch, errors, setValue, reset} = useForm({defaultValues: { id: 0, name: "" }});
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
      setMessages("عفوا : رقم التصنيف الفرعي غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم التصنيف الفرعي غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _getCategoryDetails = ( category_id ) => {
      Api.Categories.subdetails(category_id).then((res)=>{
        console.log("res", res);
        setLoadingData(false);
        if(res.statusCode === 200){
          const categoryDetails = res.data?.data;
          setCategoryData(categoryDetails[0]);
        }else{
          setCategoryData(null);
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات التصنيف الفرعي", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(categoryData){
      let categoryCurrentData = {
        id: categoryData.id,
        name: categoryData.name
      };
      reset(categoryCurrentData);
      // setValue(categoryCurrentData);
    }
  }, [categoryData])

  const _updateCategory = data => {
    Api.Categories.updateSub(data).then((res)=>{
      setLoadingData(false);
      if(res.statusCode === 202){
        NotificationManager.success('تم تحديث بيانات التصنيف الفرعي', 'نجاح', 3000);
        setTimeout(()=>{
          router.push('/app/sub-categories/'+categoryData.type_id);
        }, 200);
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات التصنيف الفرعي', 'عفواً', 3000);
      }
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      id: categoryData.id,
      catId: categoryData.type_id,
      name: fields.name,
    }
    console.log("fields", data);
    _updateCategory(data);
  }

  return (
    <Container>
        <Layout>
          { loadingData ? (
            <LoadingModal />
          ): null}

          <div>
            <Widget className="relative" title="تعديل بيانات التصنيف الفرعي" description={""} >
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
                            <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم التصنيف</span>
                            <input
                              name="name"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                              placeholder="ادخل الاسم"
                            />
                          </label>
                        </div>
                    </div>

                    <div className="w-full clear-both">
                      <div
                          className="px-10 py-3 mt-1 uppercase font-bold text-white bg-gray-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-right ml-2"
                          onClick={()=> router.back() }
                      >إلغاء</div>
                      <input
                          type="submit"
                          className="px-6 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-full cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none float-right ml-2"
                          value="حفظ"
                      />
                  </div>
                    <div className="w-full clear-both"><br></br>
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
