import React from 'react'

const LoadingModal = () => {
  return (
    <>
      <div className="backdrop fade-in fixed inset-0 z-40 bg-black"></div>
      <div className="modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-3/12 my-4 mx-auto max-w-lg">
          <div className="modal-content">
            
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadingModal
