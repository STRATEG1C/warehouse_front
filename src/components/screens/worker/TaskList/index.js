import React, { useEffect, useState } from 'react';
import MobileViewWrapper from '../../../common/MobileViewWrapper';
import { request } from '../../../../helpers/request';
import { API_TASKS } from '../../../../constants/api';
import TaskItem from '../../../common/TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    request.get(API_TASKS)
      .then((res) => setTasks(res.data.items));
  }, []);

  return (
    <MobileViewWrapper title="Задачи">
      {tasks.map(item => <TaskItem item={item} />)}
    </MobileViewWrapper>
  )
};

export default TaskList;
