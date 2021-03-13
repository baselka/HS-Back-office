import React from 'react'
import {useTable, useSortBy, usePagination, useRowSelect} from 'react-table'
import {PageWithText, Page} from '../pagination'

const IndeterminateCheckbox = React.forwardRef(
  ({indeterminate, ...rest}, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="form-checkbox h-4 w-4"
      />
    )
  }
)

const Datatable = ({columns, data}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: {pageIndex, pageSize, selectedRowIds}
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 20}
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // Header: ({getToggleAllRowsSelectedProps}) => (
          //   <>
          //     <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          //   </>
          // ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // Cell: ({row}) => (
          //   <>
          //     <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          //   </>
          // )
        },
        ...columns
      ])
    }
  )

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                  <div className="items-center justify-center text-center">
                    <span>{column.render('Header')}</span>
                    {/* Add a sort direction indicator */}
                    <span className="ltr:ml-auto rtl:mr-auto">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <icon className="icon-arrow-down text-xxs" />
                        ) : (
                          <icon className="icon-arrow-up text-xxs" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} style={{textAlign:'center'}} >{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex flex-row items-center justify-between my-4">

        <div className="items-center w-full justify-center text-center children-x-2 pagination">
          {/* {pageIndex !== 0 && (
            <PageWithText
              onClick={() => gotoPage(0)}
              color="text-default">
              الصحفة الاولى
            </PageWithText>
          )} */}
          {canPreviousPage && (
            <PageWithText
              onClick={() => previousPage()}
              color="text-default">
              الصفحة السابقة
            </PageWithText>
          )}

        <span>
          <b>
            {pageIndex + 1} من {pageOptions.length}
          </b>{' '}
        </span>


          {canNextPage && (
            <PageWithText
              onClick={() => nextPage()} disabled={!canNextPage}
              color="text-default">
              الصفحة التالية
            </PageWithText>
          )}
          {/* {pageIndex !== pageCount - 1 && (
            <PageWithText
              onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}
              color="text-default">
              الصحفة الاخيرة
            </PageWithText>
          )} */}
        </div>
{/* 
        <select
          className="form-select text-sm"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}>
          {[10, 25, 50, 100, 200].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              عرض {pageSize}
            </option>
          ))}
        </select> */}
      </div>
    </>
  )
}

export default Datatable
