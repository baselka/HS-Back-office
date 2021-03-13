import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Datatable from '../../src/components/datatable'
import Widget from '../../src/components/widget'
import { Alert } from '../../src/components/alerts'
import Link from 'next/link'
import Modal from '../../src/components/modals'
import Select from 'react-select'
import Api from '../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'

const Simple = ( { services, deleteService } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'اسم الخدمة',
        accessor: 'name'
      },
      {
        Header: 'سعر الخدمة',
        accessor: 'price',
        Cell: (props) => props.row.original.price + " ريال "
      },
      {
        Header: 'الوصف',
        accessor: 'ser_desc',
        Cell: (props) => {
          return (
            <p className={"max-w-md truncate flex-wrap h-auto break-normal text-right"} >{props.row.original.ser_desc}</p>
          );
        }
      },
      {
        Header: 'حالة الخدمة',
        accessor: 'status',
        Cell: (props) => props.row.original.status === 1 ? "فعالة" : "غير فعالة"
      },
      {
        Header: 'نوع الحجز',
        accessor: 'reservation_type',
        Cell: (props) => props.row.original.reservation_type === 1 ? "بدون حجز" : "حجز"
      },
      {
        Header: 'اعلان',
        accessor: 'promo'
      },
      {
        Header: 'ادوات',
        accessor: 'id',
        Cell: (props) => {
          return <div className="flex justify-center" >
            <Link href={"/services/edit/"+props.row.original.id} >
              <a className="float-right btn btn-default btn-blue btn-rounded btn-icon mr-1 ml-1 w-22">
                <i className="icon-note font-bold mr-1 ml-1" />
                عرض التفاصيل
              </a>
            </Link>
            <button className="float-right btn btn-default btn-red btn-rounded btn-icon mr-1 ml-1 w-22" onClick={()=>deleteService(props.row.original.id)} >
              <i className="icon-trash font-bold mr-1 ml-1" />
              <span>حذف</span>
            </button>
        </div>
        }
      }
    ],
    []
  )
  return <Datatable columns={columns} data={services} />
}

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loadingData, setLoadingData] = useState(true);
  const [services, setServices] = useState([])
  const [baranchToDeleteID, setBaranchToDeleteID] = useState('')
  const [branchName, setBranchName] = useState('')
  const [alertType, setAlertType] = useState('red')
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getAllServices();
    }else{
      setLoadingData(false);
      setServices(null);
      setMessages("عفوا : رقم الفرع غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم الفرع غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _addNew = () => {
    router.push('/services/addNew');
  }

  const _deleteService = ( service_id ) => {
    setConfirmModal(true);
    setBaranchToDeleteID(service_id);
  }

  const _deleteServiceConfirmed = () => {
    setConfirmModal(false);
    Api.Services.delete( baranchToDeleteID ).then((res)=>{
      console.log("res", res);
      if(res.statusCode === 200){
        _getAllServices();
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

  const _getAllServices = () => {
      Api.Services.all({id}).then((res)=>{
        setLoadingData(false);
        console.log('_getAllServices', res);
        if(res.statusCode === 200){
          setServices(res.data);
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

        {confirmModal && (
          <Modal change={()=>_deleteServiceConfirmed()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف الخدمة ؟'} options={null} />
        )}

        { loadingData ? (
          <LoadingModal />
        ) : (
          <>
            { services === null ? (
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
              <>
                <div className="flex text-sm mb-4">
                  <div className="w-10/12">
                    <SectionTitle title="إدارة الخدمات" subtitle={"إدارة خدمات فرع "+ branchName } />
                  </div>
                  <div className="w-2/12">
                    <button className="btn btn-default btn-pink btn-rounded btn-icon float-left ml-10 mt-3" onClick={()=>_addNew()} >
                      <i className="icon-plus font-bold mr-1 ml-1" />
                      <span>إضافة خدمة جديدة</span>
                    </button>
                  </div>
                </div>

                {services.length === 0 ? (
                  <Alert color="red" closeable={true} type="warning" raised flat >
                    {"عفوا : لاتوجد خدمات للفرع "}
                  </Alert>
                ):(
                  <Widget title={" خدمات الفرع ( "+ services.length + " )"} >
                    <div className="">
                      <Simple services={services} deleteService={_deleteService} />
                    </div>
                  </Widget>
                )}
              </>
            )}
          </>
        )}
      </Layout>
    </Container>
  )
}

export default Index
