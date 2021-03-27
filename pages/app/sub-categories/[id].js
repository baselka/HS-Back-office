import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import LoadingModal from "../../../src/components/modals/LoadingModal";
import Datatable from "../../../src/components/datatable";
import Modal from '../../../src/components/modals'
import Widget from "../../../src/components/widget";
import { Alert } from '../../../src/components/alerts';
import Link from 'next/link'
import Api from "../../../src/api";
import { useRouter } from "next/router";
import { NotificationManager } from 'react-notifications'

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Simple = ({ categories, deleteSubCat }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        width: 200
      },
      {
        Header: "اسم التصنيف",
        accessor: "name"
      },
      {
        Header: "ادوات",
        // accessor: 'id',
        Cell: props => {
          return (
            <div className={"flex-row "} >
              <div className={"inline-block"} >
                <Link href={"/app/sub-categories/edit/"+props.row.original.id} >
                  <a className="btn btn-default btn-blue rounded-full btn-icon inline-block w-24 mx-2">
                    <i className="icon-note font-bold mr-1 ml-1" />
                    تعديل
                  </a>
                </Link>
              </div>
              <div className={"inline-block"} >
                <button className="btn btn-default btn-red rounded-full btn-icon inline-block w-24 mx-2" onClick={()=>deleteSubCat(props.row.original.id)} >
                  <i className="icon-trash font-bold mr-1 ml-1" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          );
        }
      }
    ],
    []
  );
  return <Datatable columns={columns} data={categories} />;
};

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loadingData, setLoadingData] = useState(true);
  const [catToDeleteID, setCatToDeleteID] = useState('')
  const [catName, setCatName] = useState('')
  const [alertType, setAlertType] = useState('red')
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getSubCategories();
    }else{
      setLoadingData(false);
      setCategories(null);
      setMessages("عفوا : رقم التصنيف غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم التصنيف غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _deleteSubCat = ( s_id ) => {
    setConfirmModal(true);
    setCatToDeleteID(s_id);
  }

  const _deleteSubcatConfirmed = () => {
    setConfirmModal(false);
    let data = {catId:Number(id), id:catToDeleteID};
    console.log("_deleteSubcatConfirmed", data);
    Api.Categories.deleteSub(data).then((res)=>{
      _getSubCategories();
      NotificationManager.success("تم حذف التصنيف الفرعي بنجاح", 'نجاح', 3000);
    });
  }

  const _addNew = () => {
    router.push('/app/sub-categories/addNew/'+id);
  }

  const _getSubCategories = () => {
    Api.Categories.sub().then(res => {
      console.log("_getSubCategories", res);
      if (res.statusCode === 200) {
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          if(element.id == id){
            setLoadingData(false);
            setCatName(element.type_name);
            setCategories(element.sub_categories);
          }
        }
      }
    });
  };

  return (
    <Container>
      <Layout>

        {confirmModal && (
          <Modal change={()=>_deleteSubcatConfirmed()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف التنصيف الفرعي ؟'} options={null} />
        )}

        { loadingData ? (
          <LoadingModal />
        ) : (
          <>
            { categories === null ? (
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
              <>
                <div className="flex text-sm mb-4">
                  <div className="w-10/12">
                    <SectionTitle
                      title='إدارة الأقسام'
                      subtitle='إدارة الأقسام الفرعية'
                    />
                  </div>
                  <div className="w-2/12">
                    <button className="btn btn-default btn-green rounded-full btn-icon float-left ml-10 mt-3" onClick={()=>_addNew()} >
                      <i className="icon-plus font-bold mr-1 ml-1" />
                      <span>إضافة تصنيف فرعي جديد</span>
                    </button>
                  </div>
                </div>

                {categories.length === 0 ? (
                  <div className={"bg-white"} >
                    <Alert color="red" closeable={true} type="warning" raised flat >
                      {"عفوا : لاتوجد اقسام فرعية لهذا التصنيف "}
                    </Alert>
                  </div>
                ):(
                  <Widget title={" الأقسام الفرعية لفرع " + catName }>
                    <div className="">
                      <Simple categories={categories} deleteSubCat={_deleteSubCat} />
                    </div>
                  </Widget>
                )}
                </>
              )}
            </>
          )}
      </Layout>
    </Container>
  );
};

export default Index;
