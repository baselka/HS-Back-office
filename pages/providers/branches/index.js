import React, { useState, useEffect } from 'react'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Datatable from '../../../src/components/datatable/paged'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Link from 'next/link'
import Modal from '../../../src/components/modals'
import Select from 'react-select'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'

const _city = (city_id, branch_id, branch_name, cities, changeField) => {
  let name = false;
  for (let index = 0; index < cities.length; index++) {
    const element = cities[index];
    if(element.id == city_id){
      name = element.city;
    }
  }
  if(name){
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull" onClick={()=>changeField('city_id', branch_id, branch_name, 0)} title={"إضغط لتغيير المدينة"} > {name} </div>;
  }else{
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull" onClick={()=>changeField('city_id', branch_id, branch_name, 0)} title={"إضغط لتغيير المدينة"} > - غير محددة -</div>
  }
}

const _category = (category_id, branch_id, branch_name, categories, changeField) => {
  let name = false;
  for (let index = 0; index < categories.length; index++) {
    const element = categories[index];
    if(element.id == category_id){
      name = element.type_name;
    }
  }
  if(name){
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull" onClick={()=>changeField('category_id', branch_id, branch_name, 0)} title={"إضغط لتغيير التصنيف"} > {name} </div>;
  }else{
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull" onClick={()=>changeField('category_id', branch_id, branch_name, 0)} title={"إضغط لتغيير التصنيف"} > - غير محددة -</div>
  }
}

const _subCategory = (category_id, branch_id, branch_name, sub_cat_id, subCategories, changeField) => {
  let name = false;
  for (let index = 0; index < subCategories.length; index++) {
    const element = subCategories[index];
    if(element.id == category_id){
      for (let xex = 0; xex < element.sub_categories.length; xex++) {
        const subelement = element.sub_categories[xex];
        if(subelement.id == sub_cat_id){
          name = subelement.name;
        }
      }
    }
  }
  if(name){
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull"onClick={()=>changeField('sub_cat_id', branch_id, branch_name, category_id)} title={"إضغط لتغيير التصنيف الفرعي"} > {name} </div>;
  }else{
    return <div className="cursor-pointer hover:bg-pink-600 hover:text-white pyroundedfull"onClick={()=>changeField('sub_cat_id', branch_id, branch_name, category_id)} title={"إضغط لتغيير التصنيف الفرعي"} > - غير محددة -</div>
  }
}

const Simple = ( { branches, cities, categories, subCategories, changeStatus, changeField, deleteBranch, pagination, goToPage } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'اسم الفرع',
        accessor: 'branch_name'
      },
      {
        Header: 'اسم مقدم الخدمة',
        accessor: 'full_name'
      },
      {
        Header: 'المدينة',
        accessor: 'city_id',
        Cell: ( props ) => _city(props.row.original.city_id, props.row.original.branch_id, props.row.original.branch_name, cities, changeField)
      },
      {
        Header: 'التصنيف',
        accessor: 'category_id',
        Cell: ( props ) => _category(props.row.original.category_id, props.row.original.branch_id, props.row.original.branch_name, categories, changeField)
      },
      {
        Header: 'التصنيف الفرعي',
        accessor: 'sub_cat_id',
        Cell: ( props ) => _subCategory(props.row.original.category_id, props.row.original.branch_id, props.row.original.branch_name, props.row.original.sub_cat_id, subCategories, changeField)
      },
      {
        Header: 'ادوات',
        accessor: 'branch_id',
        Cell: (props) => {
          return <div className="flex justify-center" >
            <Link href={"/services/"+props.row.original.branch_id} >
              <a className="float-right btn btn-default btn-pink rounded-full btn-icon mr-1 ml-1 w-22">
                <i className="icon-eye font-bold mr-1 ml-1" />
                عرض الخدمات
              </a>
            </Link>
            <Link href={"/providers/branches/"+props.row.original.branch_id} >
              <a className="float-right btn btn-default btn-blue rounded-full btn-icon mr-1 ml-1 w-22">
                <i className="icon-note font-bold mr-1 ml-1" />
                تعديل
              </a>
            </Link>
            {(props.row.original.status === 1) &&
              <button className="float-right btn btn-default btn-orange rounded-full btn-icon mr-1 ml-1 w-32" onClick={()=>changeStatus(props.row.original, 0)} >
                <i className="icon-ban font-bold mr-1 ml-1" />
                <span>إلغاء التفعيل</span>
              </button>
            }
            {(props.row.original.status !== 1) &&
              <button className="float-right btn btn-default btn-green rounded-full btn-icon mr-1 ml-1 w-32" onClick={()=>changeStatus(props.row.original, 1)} >
                <i className="icon-ban font-bold mr-1 ml-1" />
                <span>تفعيل</span>
              </button>
            }
            <button className="float-right btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-22" onClick={()=>deleteBranch(props.row.original.branch_id)} >
              <i className="icon-trash font-bold mr-1 ml-1" />
              <span>حذف</span>
            </button>
        </div>
        }
      }
    ],
    []
  )
  return <Datatable columns={columns} data={branches} pagination={pagination} goToPage={goToPage} />
}

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [modal, setModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [hasSearch, setHasSearch] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [branches, setBranches] = useState([])
  const [cities, setCities] = useState([])
  const [searchCities, setSearchCities] = useState([])
  const [searchCategories, setSearchCategories] = useState([])
  const [searchSubCategories, setSearchSubCategories] = useState([])
  const [paginationData, setPaginationData] = useState({cuurentPage: 0, pageCount: 0, pageSize: 0, rowCount: 0});
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCityId, setSearchCityId] = useState('')
  const [searchCatID, setSearchCatID] = useState('')
  const [searchSubCatID, setSearchSubCatID] = useState('')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [modalOptions, setModalOptions] = useState([])
  const [fieldToChange, setFieldToChange] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [baranchToDeleteID, setBaranchToDeleteID] = useState('')
  const [alertType, setAlertType] = useState('red')
  const [branchIDToChange, setBranchIDToChange] = useState(0)
  const router = useRouter();

  useEffect(() => {
    _getAllCities()
    _getAllCategories()
    _getSubCategories()
    _getAllBranches(0, 10)
  }, [])

  useEffect(() => {
    _search();
  }, [searchCityId, searchCatID, searchSubCatID, hasSearch])

  const _getAllCities = () => {
    Api.Cities.all().then((res)=>{
      console.log('_getAllCities', res);
      if(res.statusCode === 200){
        setCities(res.data);
        let citlist = [{label:"كل المدن", value:0}];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          citlist.push({label:element.city, value:element.id});
        }
        setSearchCities(citlist);
      }
    });
  }

  const _changeStatus = (branch, status) => {
    let data = {
      branch_id: branch.branch_id,
      status: status
    }
    Api.Branches.changeStatus(data).then((res)=>{
      console.log('update res', res);
      if(res.statusCode === 200){
        _getAllBranches(paginationData.cuurentPage, 10);
        setAlertType('green');
        setMessages(status ? 'تم تفعيل الفرع' : 'تم إلغاء تفعيل الفرع');
        NotificationManager.success(status ? 'تم تفعيل الفرع' : 'تم إلغاء تفعيل الفرع', 'نجاح', 3000);
      }else{
        setAlertType('red');
        setMessages('حدث خطأ اثناء تغيير حالة الفرع');
        NotificationManager.error('حدث خطأ اثناء تغيير حالة الفرع', 'عفواً', 3000);
      }
    });
  }

  const _changeField = (field, branch_id, branch_name, cat_id) => {
    console.log('_changeField', field, branch_id, branch_name);
    setFieldToChange(field);
    setBranchIDToChange(branch_id);

    let name = "المدينة";
    let msgbdy = "إختر الـ " + name + " الجديدة";
    setModalOptions(cities);

    if(field === "category_id") {
      name = "التصنيف الرئيسي";
      msgbdy = "إختر الـ " + name + " الجديد ";
      setModalOptions(categories);
    };
    if(field === "sub_cat_id"){
      name = "التصنيف الفرعي";
      msgbdy = "إختر الـ " + name + " الجديد ";
      let subcat = [];
      for (let index = 0; index < subCategories.length; index++) {
        const element = subCategories[index];
        if(element.id === cat_id){
          subcat = element.sub_categories;
        }
      }
      setModalOptions(subcat);
    }
    name = "تغيير " + name + " لفرع " + branch_name;

    setModalTitle(name);
    setModalMessage(msgbdy);
    setModal(true);
  }

  const _instantEdit = (value) => {
    console.log('_changeField', fieldToChange, branchIDToChange, value);
    setModal(false);
    Api.Branches.instantEdit({field:fieldToChange, branch_id:branchIDToChange, value}).then((res)=>{
      console.log('update res', res);
      if(res.statusCode === 200){
        _getAllBranches(paginationData.cuurentPage, 10);
        setAlertType('green');
        setMessages(res.message);
        NotificationManager.success(res.message, 'نجاح', 3000);
      }else{
        setAlertType('red');
        setMessages(res.statusName);
        NotificationManager.error(res.statusName, 'عفواً', 3000);
      }
      setTimeout(() => {
        setMessages(false);
      }, 3000);
    });
  }

  const _setSearchTerm = (term) => {
    console.log(term);
    setSearchTerm(term);
  }

  const _changeSearchCity = (data) => {
    console.log(data);
    setSearchCityId(data.value);
  }

  const _changeSearchCat = (data) => {
    console.log(data);
    setSearchCatID(data.value);

    let subcat = [{label:"كل التصنيفات", value:0}];
    for (let index = 0; index < subCategories.length; index++) {
      const element = subCategories[index];
      if(element.id === data.value){
        for (let sx = 0; sx < element.sub_categories.length; sx++) {
          const subelem = element.sub_categories[sx];
          subcat.push({label:subelem.name, value:subelem.id});
        }
      }
    }
    setSearchSubCategories(subcat);
  }

  const _changeSearchSubCat = (data) => {
    console.log(data);
    setSearchSubCatID(data.value);
  }

  const _search = () => {
    var data = {
      start: 0,
      end: 10,
      city: searchCityId ? searchCityId : 0,
      cat: searchCatID ? searchCatID: 0,
      subCat: searchSubCatID ? searchSubCatID: 0,
      term: searchTerm ? searchTerm : 0,
    }
    setLoadingData(true);
    Api.Branches.search(data).then((res)=>{
      console.log('_search', res);
      setLoadingData(false);
      if(res.statusCode === 200){
        if(res.rowCount !== 0){
          setBranches(res.data);
          let resp = res;
          delete resp.data;
          setPaginationData(resp);
        }else{
          setMessages('عفوا : لاتوجد نتائج لعملية البحث');
          setAlertType('red');
          NotificationManager.error('لاتوجد نتائج لعملية البحث', 'عفواً', 3000);
        }
      }else{
        if(res.statusName){
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error(res.statusName, 'عفواً', 3000);
        }else{
          setMessages(res.data.message);
          setAlertType('red');
          NotificationManager.error(res.data.message, 'عفواً', 3000);
        }
      }
      setTimeout(() => {
        setMessages(false);
      }, 3000);
    });
  }

  const _getAllCategories = () => {
    Api.Categories.all().then((res)=>{
      console.log('_getAllCategories', res);
      if(res.statusCode === 200){
        setCategories(res.data);
        let catlist = [{label:"كل التصنيفات", value:0}];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          catlist.push({label:element.type_name, value:element.id});
        }
        setSearchCategories(catlist);
      }
    });
  }

  const _getSubCategories = () => {
    Api.Categories.sub().then((res)=>{
      console.log('_getSubCategories', res);
      if(res.statusCode === 200){
        setSubCategories(res.data);
      }
    });
  }

  const _addNew = () => {
    router.push('/providers/branches/addNew');
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      _search();
      setHasSearch(true);
    }
  }
  const _clearInputSearch = () => {
    setHasSearch(false);
    setSearchTerm('');
  }

  const _deleteBranch = ( branch_id ) => {
    setConfirmModal(true);
    setBaranchToDeleteID(branch_id);
  }

  const _goToPage = (page) => {
    console.log("paginates", page);
    _getAllBranches(page, 10);
  }

  const _deleteBranchConfirmed = () => {
    setConfirmModal(false);
    Api.Branches.delete( baranchToDeleteID ).then((res)=>{
      if(res.statusCode === 202){
        _getAllBranches(paginationData.cuurentPage, 10);
        setMessages(res.data.message);
        setAlertType('green');
        NotificationManager.success(res.data.message, 'نجاح', 3000);
      }else{
        setMessages(res.data.message);
        setAlertType('red');
        NotificationManager.error(res.data.message, 'عفواً', 3000);
        setTimeout(() => {
          setMessages(false);
        }, 3000);
      }
    });
  }

  const _getAllBranches = ( page, counts ) => {
    setLoadingData(true);
    console.log('_getAllBranchesProps', page, counts);
      Api.Branches.all(page, counts).then((res)=>{
        setLoadingData(false);
        console.log('_getAllBranches', res);
        if(res.statusCode === 200){
          setBranches(res.data);
          let resp = res;
          delete resp.data;
          setPaginationData(resp);
        }else{
          if(res.statusName){
            setMessages(res.statusName);
            setAlertType('red');
            NotificationManager.error(res.statusName, 'عفواً', 3000);
          }else{
            setMessages(res.data.message);
            setAlertType('red');
            NotificationManager.error(res.data.message, 'عفواً', 3000);
          }
          setTimeout(() => {
            setMessages(false);
          }, 3000);
        }
      });
  }

  return (
    <Container>
      <Layout>
        {loadingData && (
          <LoadingModal />
        )}

        {modal && (
          <Modal change={(value)=>_instantEdit(value)} cancel={()=>setModal(false)} title={modalTitle} message={modalMessage} options={modalOptions} />
        )}

        {confirmModal && (
          <Modal change={()=>_deleteBranchConfirmed()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف الفرع ؟'} options={null} />
        )}

      <div className="w-10/12 fixed bg-white pt-2 -mt-24" style={{width:"81.9%", borderTopWidth:97, borderTopStyle:'solid', borderTop:"97px solid #f3f6f9"}} >
        <div class="w-full p-4 mb-4">
          <div class="widget-title w-8/12 float-right">
            <div class="title text-base font-base font-bold font-poppins">إدارة الفروع</div>
          </div>
          <div class="widget-title w-4/12 float-left">
            <button className="btn btn-default btn-pink rounded-full btn-icon float-left" onClick={()=>_addNew()} >
                <i className="icon-plus font-bold mr-1 ml-1" />
                <span>إضافة فرع جديد</span>
            </button>
          </div>
        </div>

        <Widget title="بحث" className={"w-full"} id={"fixedSec"} >
          <div className="flex flex-row w-full children-x-4">
              <label className="block w-20 leading-8">اسم الفرع</label>
              <input
                name="brnachname"
                type="text"
                className={"form-input text-xs block border-red-500 w-40"}
                placeholder="ابحث عن فرع ..."
                onChange={(e)=> _setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                value={searchTerm}
              />
              {hasSearch &&
                <div className="mt-2 ml-20 -mr-12 pl-5" ><i class="icon-close text-xl font-bold text-gray-600 cursor-pointer" onClick={()=>_clearInputSearch()} ></i></div>
              }

              <label className="block w-16 leading-8 text-left">المدينة</label>
              <Select options={searchCities} className="w-40" placeholder={"اختر المدينة"} onChange={_changeSearchCity} />

              <label className="block w-20 leading-8 text-left">التصنيف</label>
              <Select options={searchCategories} className="w-40" placeholder={"اختر التصنيف"} onChange={_changeSearchCat} />
              
              <label className="block w-26 leading-8 text-left">التصنيف الفرعي</label>
              <Select options={searchSubCategories} className="w-48" placeholder={"اختر التصنيف الفرعي"} onChange={_changeSearchSubCat} />

            <button className="btn btn-default btn-blue rounded-full btn-icon mr-1 ml-1"  style={{width:80}} onClick={()=>_search()} >
              <i className="icon-magnifier font-bold mr-1 ml-1" />
              <span>بحث</span>
            </button>

          </div>
        </Widget>
        </div>

        { branches.length === 0 ? (
          <LoadingModal />
        ) : (
          <Widget title={"قائمة الفروع ( "+ paginationData.rowCount + " )"} className={"pt52px"} >
            <div className="">
              <Simple branches={branches} cities={cities} categories={categories} subCategories={subCategories} changeStatus={_changeStatus} changeField={_changeField} deleteBranch={_deleteBranch} pagination={paginationData} goToPage={_goToPage} />
            </div>
          </Widget>
        )}
      </Layout>
    </Container>
  )
}

export default Index
