import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import Select from 'react-select'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Modal from '../../../src/components/modals'
import ImageSelector from "../../providers/branches/imageSelector"

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [serviceData, setServiceData] = useState(null)
  const [imagesList, setImagesList] = useState([])
  const [serviceImages, setServiceImages] = useState([])
  const [featureList, setFeatureList] = useState([])
  const [featureValues, setFeatureValues] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [accountTypes, setAccountTypes] = useState([{label:"مدير لوحة التحكم", value:1},{label:"ممثل خدمة العملاء",value:2}]);
  const {register, handleSubmit, watch, errors, setValue, reset} = useForm({defaultValues: { id: 0, name: "", ser_desc: "", price: "" }});
  const [serviceID, setServiceID] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false)
  const [toDeleteID, setToDeleteID] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  
  const _removeServiceImage = ( image_id ) => {
    setConfirmModal(true);
    setToDeleteID(image_id);
  }

  useEffect(() => {
    if(id){
      _getServiceDetails(id);
    }else{
      setLoadingData(false);
      setServiceData(null);
      setMessages("عفوا : رقم الخدمة غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم الخدمة غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _getFeaturesList = ( cat_id ) => {
    console.log("category_id", cat_id);
    Api.Features.all(cat_id).then((res)=>{
      setLoadingData(false);
      console.log("_getFeaturesList", res);
      setFeatureList(res?.data);
    });
  }

  const _getBrachDataAndServices = ( branch_id ) => {
    Api.Branches.details(branch_id).then((res)=>{
      console.log("_getBrachDataAndServices", res);
      if(res?.statusCode === 200 && res?.data?.branchDetails?.length){
        const { branchDetails } = res?.data;
        if(branchDetails[0]?.category_id){
          _getFeaturesList(branchDetails[0]?.category_id);
        }else{
          setLoadingData(false);
        }
      }else{
        setLoadingData(false);
      }
    });
  }
  
  const _getInputDefaultValue = ( feat_id ) => {
    for (let index = 0; index < featureValues.length; index++) {
      const element = featureValues[index];
      if(element.feature_id == feat_id){
        return element.value;
      }
    }
  }

  const _getServiceDetails = ( service ) => {
      let data = {
        service_id: service
      }
      Api.Services.details(data).then((res)=>{
        console.log("details", res);
        if(res?.statusCode === 200){
          setServiceData(res?.data);
          _getBrachDataAndServices(res?.data?.branch_id);
          if(res?.data && res?.data?.images){
            setServiceImages(res?.data?.images);
          }
          if(res?.data?.features){
            const rFeatures = res?.data?.features;
            var defFeats = [];
            if(rFeatures){
              for (let index = 0; index < rFeatures.length; index++) {
                const element = rFeatures[index];
                console.log("setFeatureValues element", element);
                defFeats.push({feature_id: element.id, value: element.value});
              }
              setFeatureValues(defFeats);
            }
            console.log("setFeatureValues rFeatures", rFeatures);
          }else{
            console.log("setFeatureValues", "null");
          }
        }else{
          setLoadingData(false);
          setServiceData(null);
          setMessages(res?.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات الخدمة", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(serviceData){
      let serviceCurrentData = {
        id: serviceData.id,
        name: serviceData.name,
        ser_desc: serviceData.ser_desc,
        price: serviceData.price
      };
      reset(serviceCurrentData);
      // setValue(serviceCurrentData);
    }
  }, [serviceData, featureList]);

  const _updateService = data => {
    console.log("_updateService", data);
    Api.Services.update(data).then((res)=>{
      console.log("_updateService", res);
      if(!res) {
        setLoadingData(false);
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات الخدمة', 'عفواً', 3000);
        _getServiceDetails(id);
        return;
      }
      if(res?.statusCode === 200){
        NotificationManager.success('تم تحديث بيانات الخدمة', 'نجاح', 3000);
        if(imagesList && imagesList.length > 0){
          var data = { id: id, images: imagesList };
          Api.Services.uploadServiceImages(data).then((res)=>{
            console.log("uploadServiceImages", res);
            setLoadingData(false);
            _getServiceDetails(id);
            NotificationManager.success('تم تحديث صور الخدمة', 'نجاح', 3000);
          });
        }else{
          setLoadingData(false);
        }
      }else{
        setLoadingData(false);
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات الخدمة', 'عفواً', 3000);
      }
    });
  }

  const _confirmRemoveImage = () => {
    setConfirmModal(false);
    setLoadingData(true);
    var data = {service: id, image: toDeleteID};
    Api.Services.deleteImage(data).then((res)=>{
      if(res?.statusCode === 201){
        NotificationManager.success('تم حذف الصورة بنجاح', 'نجاح', 3000);
        setLoadingData(false);
        _getServiceDetails(id);
      }else{
        NotificationManager.error("حدث خطأ اثناء حذف الصورة", 'عفواً', 3000);
      }
    });
  }

  const _updateFeatureValue = async (feature, event) => {
    console.log("feature", feature);
    console.log("event", event.target.value);
    const vals = event.target.value;
    let tempValues = featureValues;    
    let avail = false;
    for (let index = 0; index < tempValues.length; index++) {
      const element = tempValues[index];
      if(element.feature_id == feature.id){
        avail = true;
      }
    }

    if(avail){
      for (let index = 0; index < tempValues.length; index++) {
        const featValue = tempValues[index];
        if(featValue.feature_id == feature.id){
          featValue.value = vals;
        }
        tempValues[index] = featValue;
      }
    }else{
      tempValues.push({feature_id: feature.id, value: vals});
    }
    setFeatureValues(tempValues);
  }

  useEffect(() => {
    console.log("tempValues", featureValues);
  }, [featureValues])

  const onSubmit = fields => {
    console.log("fields", fields);
    setLoadingData(true);
    let data = {
      id,
      name: fields.name,
      desc: fields.ser_desc,
      price: fields.price
    }
    if(featureValues){
      data.features = featureValues;
    }else{
      data.features = [];
    }
    _updateService(data);
  }

  return (
    <Container>
      <Layout>
          { loadingData ? ( 
            <LoadingModal />
          ) : null }
          { serviceData === null ? (
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
            {confirmModal && (
              <Modal change={()=>_confirmRemoveImage()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف الصورة ؟'} options={null} />
            )}
            <Widget className="relative" title="تعديل بيانات الخدمة" description={""}>
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
                        className="px-4 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-full cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none float-left ml-2"
                        value="تحديث الخدمة"
                    />
                  </div>
                  
                  <div className="w-full clear-both">
                    {messages && (
                      <div className={"bg-white"} >
                        <Alert color="red" raised flat >
                          {messages}
                        </Alert>
                      </div>
                    )}
                  </div>

                  <Widget title="" className="mt-12 bg-gray-100 w-10/12" >
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
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white mt-2"
                            placeholder="ادخل السعر"
                          />
                        </label>
                      </div>
                      <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                        <label className="block">
                          <span className="text-default">الوصف</span>
                          <textarea
                            name="ser_desc"
                            ref={register({required: true})}
                            className="form-input mt-1 text-xs block w-full bg-white mt-2"
                            placeholder="اكتب معلومات عن الخدمة"
                            style={{minHeight:169}}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex-col w-8/12 mb-4 ml-0 float-right">
                      {featureList.map((feature, index) => (
                        <div key={index} className={index%2 ? "w-6/12 mb-6 p-5 bg-white border-2 border-gray-200 float-right" : "w-6/12 mb-6 p-5 bg-white border-2 border-gray-200 float-right ml-3 -mr-3" } >
                          <div key={index} className="row">
                            <img src={feature.image} className="w-5 float-right" alt="..." />
                            <span className="text-default m-3">{feature.name}</span>
                          </div>
                          <label className="block">
                            <input
                              name={"id"+feature.id}
                              type="text"
                              defaultValue={_getInputDefaultValue(feature.id)}
                              onChange={(e)=>_updateFeatureValue(feature, e)}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder={feature.description}
                            />
                          </label>
                        </div>
                      ))}
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
                    <br></br>
                  </div>

                </Widget>
              </form>
            </Widget>
            </div>
          )}
        </Layout>
    </Container>
  )
}

export default Index
