import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Select from 'react-select'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import ImageSelector from "./imageSelector"

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZXyEzKc1WXdZeXh9zyWCiRJQDEJXOfPo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
  >
    <Marker
      position={{ lat: props.latitude, lng: props.longitude }}
      defaultDraggable={true}
      onDragEnd={props.onMarkerDragEnd}
    />
  </GoogleMap>
);

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [modal, setModal] = useState(false)
  const [branches, setBranches] = useState(['1'])
  const [providerID, setProviderID] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [cityID, setCityID] = useState({label:'', value:null})
  const [categoryID, setCategoryID] = useState({label:'', value:null})
  const [subCategoryID, setSubCategoryID] = useState({label:'', value:null})
  
  const [selectedProvider, setSelectedProvider] = useState()
  const [selectedCity, setSelectedCity] = useState()
  const [selectedCat, setSelectedCat] = useState()
  const [selectedSubCat, setSelectedSubCat] = useState()
  
  const [citiesList, setCitiesList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [imagesList, setImagesList] = useState([])
  const [defaultImagesList, setDefaultImagesList] = useState([])
  const [imagesIDsToRemove, setImagesIDsToRemove] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [subCategoriesList, setSubCategoriesList] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [providerType, setProviderType] = useState({label:'مقدم خدمة مسجل مسبقا',value:'Registered'})
  const [providersList, setProvidersList] = useState([{label:'مقدم خدمة تجريبي',value:"1"}])
  const [providerTypeOpts, setProviderTypeOpts] = useState([{label:'-- إختر نوع مقدم الخدمة --',value:"null"},{label:'مقدم خدمة مسجل مسبقا',value:'Registered'},{label:'مقدم خدمة جديد',value:'New'}]);
  const [latitude, setLatitude] = useState(24.7249316);
  const [longitude, setLongitude] = useState(46.5423435);
  const {register, handleSubmit, watch, errors, setValue} = useForm();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log('router.query', router);
    console.log('branchData id', id);
    if(id){
      _getBrancheDetails(id);
    }else{
      setLoadingData(false);
      setBranchData(null);
      setMessages("عفوا : رقم الفرع غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم الفرع غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _removeBranchImage = ( image_id ) => {
    console.log('image_id', image_id);
    let imagesIDs = imagesIDsToRemove;
    imagesIDs.push(image_id);
    setImagesIDsToRemove(imagesIDs);

    let newListimgs = [];
    let curImages = defaultImagesList;
    for (let index = 0; index < curImages.length; index++) {
      const imGent = curImages[index];
      if(imGent.id !== image_id){
        newListimgs.push(imGent);
      }
    }
    setDefaultImagesList(newListimgs);
  }

  const _getBrancheDetails = ( branch_id ) => {
      Api.Branches.details(branch_id).then((res)=>{
        console.log('_getBrancheDetails', res);
        if(res.statusCode === 200){
          const { branchDetails } = res.data;
          if(branchDetails[0].lat && branchDetails[0].lat){
            setLatitude(branchDetails[0].lat);
            setLongitude(branchDetails[0].lon); 
          }
          setBranchData(branchDetails[0]);
          setDefaultImagesList(res.data.branchImages);
        }else{
          setLoadingData(false);
          setBranchData(null);
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات الفرع", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(branchData){
      _getAllCities();
      _getAllCategories();
      _getSubCategories();
      _getProvidersList();

      let branchCurrentData = [
        { branch_name: branchData.branch_name },
        { branch_desc: branchData.branch_desc },
        { whats: branchData.whats },
        { twitter: branchData.twitter },
        { facebook: branchData.facebook },
        { snapchat: branchData.snapchat },
        { insta: branchData.insta },
        { telephone: branchData.telephone },
        { city_id: branchData.city_id },
        { category_id: branchData.category_id },
        { email: branchData.email },
        { lat: branchData.lat },
        { lon: branchData.lon },
        { sub_cat_id: branchData.sub_cat_id },
        { provider_id: branchData.provider_id }
      ];
      console.log('branchCurrentData', branchCurrentData);
      setTimeout(() => {
        setValue(branchCurrentData);
      }, 500);
    }
  }, [branchData])

  useEffect(() => {
    if(providersList && subCategoriesList && subCategories && branchData && cityID && categoryID && subCategoryID && selectedProvider && selectedCity && selectedCat && selectedSubCat && citiesList && categoriesList){
      setLoadingData(false);
    }
  }, [longitude, latitude, providersList, subCategoriesList, subCategories, defaultImagesList, imagesList, branchData, cityID, categoryID, subCategoryID, selectedProvider, selectedCity, selectedCat, selectedSubCat, citiesList, categoriesList])
  
  const _onMarkerDragEnd = (e) => {
    setLatitude(e.latLng.lat())
    setLongitude(e.latLng.lng())
  };

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
          if(element.provider_id == branchData.provider_id){
            setSelectedProvider({label:element.full_name, value:element.provider_id});
          }
        }
        setProvidersList(plist);
      }
    });
  }

  const _getAllCities = () => {
    Api.Cities.all().then((res)=>{
      console.log('_getAllCities', res);
      if(res.statusCode === 200){
        let citlist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          citlist.push({label:element.city, value:element.id});
          if(element.id == branchData.city_id){
            setCityID({label:element.city, value:element.id});
            setSelectedCity({label:element.city, value:element.id});
          }
        }
        setCitiesList(citlist);
      }
    });
  }

  const _getAllCategories = () => {
    Api.Categories.all().then((res)=>{
      console.log('_getAllCategories', res);
      if(res.statusCode === 200){
        let catlist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          catlist.push({label:element.type_name, value:element.id});
          if(element.id == branchData.category_id){
            setCategoryID({label:element.type_name, value:element.id});
            setSelectedCat({label:element.type_name, value:element.id});
          }
        }
        setCategoriesList(catlist);
      }
    });
  }

  const _getSubCategories = () => {
    Api.Categories.sub().then((res)=>{
      console.log('_getSubCategories', res);
      if(res.statusCode === 200){
        setSubCategories(res.data);
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          if(element.id == branchData.category_id){
              for (let xex = 0; xex < element.sub_categories.length; xex++) {
                const eSubcat = element.sub_categories[xex];    
                if(eSubcat.id == branchData.sub_cat_id){
                  setSubCategoryID({label:eSubcat.name, value:eSubcat.id});
                  setSelectedSubCat({label:eSubcat.name, value:eSubcat.id});
                } 
              }
          }
        }
      }
    });
  }

  const _updateSubCategories = (cat) => {
    setCategoryID(cat);
    let subcat = [];
    for (let index = 0; index < subCategories.length; index++) {
      const element = subCategories[index];
      if(element.id === cat.value){
        for (let sx = 0; sx < element.sub_categories.length; sx++) {
          const subelem = element.sub_categories[sx];
          subcat.push({label:subelem.name, value:subelem.id});
        }
      }
    }
    setSubCategoriesList(subcat);
  }

  const _setProviderID = fields => {
    console.log('_setProviderID', fields);
    setProviderID(fields.value)
  }

  const _updateBranch = data => {
    console.log('_updateBranch', data);
    Api.Branches.update(data).then((res)=>{
      console.log('_updateBranch res', res);
      if(res.statusCode === 200){
        NotificationManager.success('تم تحديث بيانات فرع '+ data.branch_name +' بنجاح ', 'نجاح', 3000);
        if(imagesIDsToRemove && imagesIDsToRemove.length > 0){
          _confirmBranchImageRemoval();
        }
        if(imagesIDsToRemove && imagesIDsToRemove.length > 0){
          _uploadBranchImages(id);
        }else{
          NotificationManager.success('تم تحديث بيانات فرع '+ data.branch_name +' بنجاح ', 'نجاح', 3000);
          setTimeout(() => {
            setLoadingData(false);
            router.push('/providers/branches');
          }, 1000);
        }
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات الفرع', 'عفواً', 3000);
        setLoadingData(false);
        router.push('/providers/branches');
      }
    });
  }

  const _confirmBranchImageRemoval = () => {
    // imagesIDsToRemove
    for (let index = 0; index < imagesIDsToRemove.length; index++) {
      const imgid = imagesIDsToRemove[index];
      var data = {branch: id, image: imgid};
      Api.Branches.deleteImage(data).then((res)=>{
        console.log('removeBranchImages', res);
      });
    }
  }

  const _uploadBranchImages = branch => {
    var data = {id: branch, images: imagesList};
    Api.Branches.uploadBranchImages(data).then((res)=>{
      console.log('uploadBranchImages', res);
      NotificationManager.success('تم إضافة فرع صور الفرع بنجاح ', 'نجاح', 3000);
      setTimeout(() => {
        setLoadingData(false);
        router.push('/providers/branches');
      }, 2000);
    });
  }

  const onSubmit = fields => {
    console.log('fields', fields);
    setLoadingData(true);
    let data = {
      ...fields,
      lat: latitude,
      lon: longitude,
      city_id: cityID.value,
      category_id: categoryID.value,
      sub_cat_id: subCategoryID.value,
      branch_id: id,
      address: branchData.address,
      status: fields.status ? fields.status : 2
    }
    _updateBranch(data);
  }

  return (
    <Container>
      { loadingData ? ( 
        <Layout>
          <LoadingModal />
        </Layout>
      ) : (
        <Layout>
          { branchData === null ? (
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
              <Widget title="تعديل بيانات الفرع" description={""}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-sm mb-4 w-full"
                    defaultValue  
                  >
                  <Widget title="" className="bg-gray-100 w-10/12" >
                      <div className="flex-col w-96 mb-4 ml-6 float-right">
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم الفرع</span>
                              <input
                                name="branch_name"
                                type="text"
                                ref={register({required: true})}
                                className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                                placeholder="ادخل اسم الفرع"
                              />
                            </label>
                          </div>
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>إختر مقدم الخدمة</span>
                              <Select name="provider_id" options={providersList} className="w-full mt-2" placeholder={"-- إختر مقدم الخدمة --"} onChange={(data)=> { _setProviderID(data); setSelectedProvider(data)}} defaultValue={selectedProvider} />
                            </label>
                          </div>
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>المدينة</span>
                              <Select name="city_id" options={citiesList} className="w-full mt-2" placeholder={"-- إختر المدينة --"} onChange={(data)=> { setCityID(data); setSelectedCity(data)}} defaultValue={selectedCity} />
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
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الرئيسي</span>
                              <Select name="category_id" options={categoriesList} className="w-full mt-2" placeholder={"-- إختر التصنيف الرئيسي --"} onChange={(data)=> { _updateSubCategories(data); setSelectedCat(data)}} defaultValue={selectedCat} />
                            </label>
                          </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الفرعي</span>
                              <Select name="sub_cat_id" options={subCategoriesList} className="w-full mt-2" placeholder={"-- إختر التصنيف الفرعي --"} onChange={(data)=> { setSubCategoryID(data); setSelectedSubCat(data)} } defaultValue={selectedSubCat} />
                            </label>
                          </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">رقم الجوال</span>
                            <input
                              name="telephone"
                              type="number"
                              ref={register({required: true})}
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
                              ref={register({required: true})}
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
                              ref={register({required: true})}
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
                              ref={register({required: true})}
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
                              ref={register({required: true})}
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
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل حساب انستغرام"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">معلومات عن الفرع</span>
                            <textarea
                              name="branch_desc"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="اكتب معلومات عن الفرع"
                              style={{minHeight:110}}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default mb-2 block">صور الفرع (10 صور كـ حد اقصى)</span>
                          </label>
                          
                          <div className="form-group multi-preview addNewImageCont" >
                              {defaultImagesList.map((imag, index) => (
                                  <div className="float-right m-0 border-8 border-transparent rounded shadow-sm w-4/12 h-96 imagecontainer relative">
                                      <img key={index} src={imag.img_path} className="" alt="..." />
                                      <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=>_removeBranchImage(imag.id)} />
                                  </div>
                              ))}
                          </div>
                          <ImageSelector uploadImages={setImagesList} />
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default mb-2 block">موقع الفرع</span>
                            <MapComponent
                              latitude={Number(latitude)}
                              longitude={Number(longitude)}
                              onMarkerDragEnd={_onMarkerDragEnd}
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
