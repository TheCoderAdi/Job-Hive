import { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setLocation, setIndustry, setSalary, setSearchedQuery } from '@/redux/jobSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const Jobs = () => {
  const { allJobs, location: selectedLocation, industry: selectedIndustry, salary: selectedSalary } = useSelector(
    (store) => store.job
  );
  const [searchedQuery, setSearchedQueryState] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const locationParam = queryParams.get('location') || '';
    const industryParam = queryParams.get('industry') || '';
    const salaryParam = queryParams.get('salary') || '';

    setSearchedQueryState(search);
    dispatch(setLocation(locationParam));
    dispatch(setIndustry(industryParam));
    dispatch(setSalary(salaryParam));
  }, [location.search, dispatch]);

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setSearchedQueryState(searchQuery);
    dispatch(setSearchedQuery(searchQuery));

    const params = new URLSearchParams(location.search);
    if (searchQuery) params.set('search', searchQuery);
    else params.delete('search'); 

    navigate({ search: params.toString() });
  };

  useEffect(() => {
    let filteredJobs = allJobs.filter((job) => {
      return (
        (searchedQuery ? job.title.toLowerCase().includes(searchedQuery.toLowerCase()) : true) &&
        (selectedLocation ? job.location.toLowerCase() === selectedLocation.toLowerCase() : true) &&
        (selectedIndustry ? job.description.toLowerCase() === selectedIndustry.toLowerCase() : true) &&
        (selectedSalary ? job.salary <= selectedSalary : true)
      );
    });
    setFilteredJobs(filteredJobs);
  }, [allJobs, searchedQuery, selectedLocation, selectedIndustry, selectedSalary]);

  const removeJobHandler = (job)=>{
    const jobs = localStorage.getItem('savedJobs') ? JSON.parse(localStorage.getItem('savedJobs')) : []
    const newJob = jobs.filter(j => j._id !== job._id)  
    localStorage.setItem('savedJobs', JSON.stringify(newJob))
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        {/* Search and filter section */}
        <div className="flex items-center gap-4 mb-5">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchedQuery}
            onChange={handleSearchChange}
            className="p-2 border rounded-md flex-1"
          />
        </div>

        {/* Main content */}
        <div className="flex gap-5">
          <div className="w-1/5">
            <FilterCard />
          </div>
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {filteredJobs.length <= 0 ? (
              <span>No jobs found</span>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
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

export default Jobs;
