import React, { useState } from 'react';   
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  refershPage: () => void;
  setFormSubmitted: any;
  isEdit: boolean;
   taskToEdit: any;
}

interface MyFormValues {
  id: number | null;
  name: string;
  description: string;
  date: Date;
  status: string;
  priority: string;
}

const Dialogue: React.FC<ModalProps> = ({ isOpen, onClose, refershPage, setFormSubmitted, taskToEdit, isEdit   }) => {
  // const [date, setDate] = useState<Date | null>(null);
  
  
  
  if (!isOpen) return null;
  
  const initialValues: MyFormValues = {
    id: isEdit? taskToEdit.id : null,
    name: isEdit ? taskToEdit.name : '',
    description: isEdit ? taskToEdit.description : '',
    date: isEdit?  new Date(taskToEdit.date) : new Date(),
    status: isEdit ? taskToEdit.status : '',
    priority: isEdit ? taskToEdit.priority : '',
  };
  
  const [date, setDate] = useState<Date>(new Date());

  const validationSchema = Yup.object({
    name: Yup.string().required('Task name is required'),
    description: Yup.string().required('Task description is required'),
    date: Yup.date().required('Due date is required'),
    status: Yup.string().required('Status is required'),
    priority: Yup.string().required('Priority is required'),
  });

  function generateID() {
    return Math.floor(Math.random()*100000000);
  }
  
  console.log(generateID());
  
  const onSubmit = (values: MyFormValues, { resetForm }: { resetForm: () => void }) => {

    if(isEdit){
      const tasksFromStorage = localStorage.getItem('tasks');

      const tasksArray : any[] = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
        
      const updatedTasksArray = tasksArray.map(task => 
        task.id === taskToEdit.id ? { ...task, ...values } : task
      );
      
      const updatedTasksJSON = JSON.stringify(updatedTasksArray);
      localStorage.setItem('tasks', updatedTasksJSON);

    }
    else{
  
      const id = generateID();
      const newvalue = {...values, id }

      const tasksFromStorage = localStorage.getItem('tasks');

      const tasksArray : any[] = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];

      tasksArray.push(newvalue);

      const updatedTasksJSON = JSON.stringify(tasksArray);

      localStorage.setItem('tasks', updatedTasksJSON);
    }
    setFormSubmitted(true);
    resetForm();
    refershPage();

    onClose()

  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
              onClick={onClose}
            />
            
            {/* Modal Content */}
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  &times;
                </button>

                {/* Formik's Form component */}
                <Form className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="name">Task Name</label>
                    <Field className="border-2" type="text" name="name" placeholder="Enter task..." />
                    <ErrorMessage name="name" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label htmlFor="description">Task Description</label>
                    <Field className="border-2" as="textarea" name="description" placeholder="Enter task description" />
                    <ErrorMessage name="description" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col gap-y-2 w-[250px]">
                    <label htmlFor="date">Due Date</label>
                    <Calendar
                      className="border-2"
                      value={date}
                      onChange={(e:any) => {
                        setDate(e.value);
                        setFieldValue('date', e.value);
                      }}
                      showIcon
                      name="date"
                        dateFormat="yy-mm-dd"
                    />
                    <ErrorMessage name="date" component="div" className="error text-red-500" />
                  </div>

                  <div className="flex flex-col gap-y-4 w-[250px]">
                    <label htmlFor="status">Task Status</label>
                    <Field className="border-2" as="select" name="status">
                      <option value="">Select Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="error text-red-500" />
                  </div>

                  <div className="flex flex-col gap-y-2 w-[250px]">
                    <label htmlFor="priority">Priority</label>
                    <Field className="border-2" as="select" name="priority">
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Field>
                    <ErrorMessage name="priority" component="div" className="error text-red-500" />
                  </div>

                  <button className="bg-blue-800 text-white" type="submit">
                    {isEdit ? 'UPDATE' : 'ADD' }
                  </button>
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default Dialogue;
