import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingFn,
    SortingState,
    getFilteredRowModel,
   

  } from '@tanstack/react-table'
import React, { useEffect, useState } from "react";
import Dialogue from '../Components/Dialogue';
import moment from 'moment';



type Person = {
    id: number;
    name: string;
    description : string;
    date: string;
    status: string;
    priority: string;
  }

// const Tasks : Person[] = [
//     {
//         id : 1,
//         name : "Taskone",
//         description : "Description of taskone",
//         date : "12-09-2024",
//         status : "Pending",
//         priority : "High"
//     },
//     {
//         id : 2,
//         name : "Tasktwo",
//         description : "Description of tasktwo",
//         date : "15-09-2024",
//         status : "Completed",
//         priority : "Low"
//     },
//     {
//         id : 3,
//         name : "Taskthree",
//         description : "Description of taskthree",
//         date : "13-09-2024",
//         status : "Pending",
//         priority : "Low"
//     },
//     {
//         id : 4,
//         name : "Taskfour",
//         description : "Description of taskfour",
//         date : "14-09-2024",
//         status : "Completed",
//         priority : "Medium"
//     },
//     {
//         id : 5,
//         name : "Taskfive",
//         description : "Description of taskfive",
//         date : "17-09-2024",
//         status : "Pending",
//         priority : "High"
//     },
//     {
//         id : 6,
//         name : "Tasksix",
//         description : "Description of tasksix",
//         date : "16-09-2024",
//         status : "Completed",
//         priority : "Medium"
//     },
//  ];
     
const Home = () => { 
  const [taskToEdit, setTaskToEdit] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  const sortStatusFn: SortingFn<Person> = (rowA, rowB, _columnId) => {
    const statusA = rowA.original.priority
    const statusB = rowB.original.priority
    const statusOrder = [ 'High', 'Medium' , 'Low']
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
  }

 const columnHelper = createColumnHelper<Person>()

  const columns = [
    columnHelper.accessor('id', {
      header: () => <span> ID</span>,
          }),
    columnHelper.accessor('name', {
      header: () => <span>TASK Name</span>,
           
    }),
    columnHelper.accessor('description',{
        header: () => <span>DESCRIPTION</span>,
            }),
            columnHelper.accessor('date', {
              header: () => <span>DUE DATE</span>,
              cell: (info) => {
                const date = info.getValue();
                return moment(date).format('DD/MM/YYYY'); // Customize format
              },
            }),
    columnHelper.accessor('status', {
      header: () => <span>STATUS</span>,
           
    }),
    columnHelper.accessor('priority', {
      header: () => <span>PRIORITY</span>,
            sortingFn: sortStatusFn
    }),
    columnHelper.display({
        id: 'actions',
        header: () => <span>ACTIONS</span>,
        cell: info => (
          <div className="flex space-x-2 items-center">
            <button
              className="text-blue-500 hover:text-blue-700"
               onClick={() => handleEdit(info.row.original)}
            
            >
              Edit
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(info.row.original)}
            >
              Delete
            </button>
          </div>
        ),
      }),
    ];
    
    //  action handlers
    const handleEdit = (rowData : any) => {
      console.log('Edit', rowData);
      // Implement edit logic here
      setIsEdit(true);
      setTaskToEdit(rowData);
      setIsOpen(true); 
    };
    
    const handleDelete = (rowData : any) => {
      console.log('Delete', rowData);
      // Implement delete logic here
       const tasksFromStorage = localStorage.getItem('tasks')
       const tasksArray : any[] = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
       const arrayToRemove = tasksArray.filter(task => task.id !== rowData.id )
       localStorage.setItem('tasks' ,JSON.stringify(arrayToRemove));
       refershPage();
    };

  const tasksFromStorage = localStorage.getItem('tasks');

// Convert the JSON string back to an array of objects
const tasksArray : any[] = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
    const [data, setData] = React.useState<Person[]>(() => [...tasksArray])
  // const rerender = React.useReducer(() => ({}), {})[1]
  const [sorting, setSorting] = React.useState<SortingState>([])
   const [isOpen , setIsOpen] = useState(false)
   const [loading , setLoading] = useState(false)
   const [formSubmitted, setFormSubmitted] = useState(false);

  

   //  useEffect(()=>{
  //   _setData(tasksArray)
  //  },[])

  useEffect(() => {
    if (formSubmitted) {
      refershPage();   // Refresh the page when form is submitted
      setFormSubmitted(false); // Reset form submission state
    }
  }, [formSubmitted]);
  
   const refershPage = ()=>{
    setLoading(true);
    // console.log("loading is true");
    const tasksFromStorage = localStorage.getItem('tasks'); 
    const tasksArray: Person[] = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
    setData(tasksArray);
    setLoading(false);
   }

   const openModal = () => {
     setIsOpen(true)

  }
  const onCloseModal = () => {
    setIsOpen(false)
    setIsEdit(false);
    setTaskToEdit({})
 }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        sorting,
      },
         
  })

  return (
    <>
    {
      loading && <div>loading...</div>
    }
    <Dialogue isOpen={isOpen}  onClose={onCloseModal} refershPage={refershPage} setFormSubmitted={setFormSubmitted} isEdit={isEdit} taskToEdit={taskToEdit}  />
    <div className='flex gap-5 flex-col items-center'>
        <h1 className='text-3xl font-bold mt-6'>Task Manager</h1>
    <div className=' flex gap-5 justify-center items-center '>
               <button onClick={openModal} className='border-3 bg-blue-800 text-white p-1 rounded hover:bg-blue-400 px-3'>ADD TASK</button>
    </div>
    <div className="overflow-x-auto border-2">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
 {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                         {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody className="bg-white divide-y divide-gray-200 ">
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td
              key={cell.id}
              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 not-italic"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
</>
  )
}

function Filter({
    column,
    table,
  }: {
    // column: Column<any, any>
    // table: Table<any>
    column:any
    table:any
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)
  
    const columnFilterValue = column.getFilterValue()
  
    return typeof firstValue === 'number' ? (
      <div className="flex space-x-2">
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
    ) : (
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        className="w-36 border shadow rounded"
      />
    )
  }

export default Home;