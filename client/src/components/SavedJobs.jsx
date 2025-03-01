import Navbar from './shared/Navbar';
import Job from './Job';
import { motion } from 'framer-motion';
import { useState } from 'react';

const SavedJobs = () => {
  const [jobs,setJobs] = useState(
    localStorage.getItem('savedJobs') ? JSON.parse(localStorage.getItem('savedJobs')) : [])
    

    const removeJobHandler = (job)=>{
      const newJob = jobs.filter(j => j._id !== job._id)  
      localStorage.setItem('savedJobs', JSON.stringify(newJob))
      let savedJobs = localStorage.getItem('savedJobs') ? JSON.parse(localStorage.getItem('savedJobs')) : []
      setJobs(savedJobs)
    }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="flex-1 h-full pb-5">
            {jobs.length <= 0 ? (
              <span>No jobs found</span>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} removeJobHandler={removeJobHandler}/>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
