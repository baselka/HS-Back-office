import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../../Container'
import Layout from '../../../../src/layouts'
import Widget from '../../../../src/components/widget'
import Api from "../../../../src/api";
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
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

  const _createSubCategory = data => {
    Api.Categories.subcategory(data).then((res)=>{
      console.log("create", res);
      setLoadingData(false);
      NotificationManager.success('تم اضافة التصنيف الفرعي', 'نجاح', 3000);
      router.push('/app/sub-categories/'+id);
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      name: fields.name,
      catId: id,
    }

    console.log("fields", data);
    _createSubCategory(data);
  }

  return (
    <Container>
        <Layout>
          { loadingData ? (
            <LoadingModal />
          ): null}

          <div>
          <Widget title="اضافة تصنيف فرعي" description={""} >
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
                          <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم التصنيف الفرعي</span>
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
