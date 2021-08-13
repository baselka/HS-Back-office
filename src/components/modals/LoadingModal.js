import React from 'react'
const styles = {

}
const LoadingModal = () => {
  return (
    <>
      <div className="backdrop fade-in fixed inset-0 z-40 bg-black"></div>
      <div className="modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full justify-center items-center text-center">
          <div className="loadingmodal">
              <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadingModal
