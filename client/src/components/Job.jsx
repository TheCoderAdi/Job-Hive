import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

const Job = ({ job, removeJobHandler }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { isLoading } = useSelector((store) => store.job);

  const [isSaved, setIsSaved] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  useEffect(() => {
    const jobs = localStorage.getItem('savedJobs')
      ? JSON.parse(localStorage.getItem('savedJobs'))
      : [];
    const isJobSaved = jobs.find((j) => j._id === job._id);
    setIsSaved(!!isJobSaved); 
  }, [job._id]);

  const saveJobHandler = (job) => {
    const jobs = localStorage.getItem('savedJobs')
      ? JSON.parse(localStorage.getItem('savedJobs'))
      : [];

    if (isSaved) {
      removeJobHandler(job);
      setIsSaved(false); 
    } else {
      jobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(jobs));
      setIsSaved(true); 
    }

    toast.success(isSaved ? 'Job removed from saved jobs' : 'Job saved successfully');
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? 'Today'
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={() => saveJobHandler(job)}
        >
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            {isLoading ? (
              <Skeleton className="w-10 h-10 rounded-full bg-gray-400" />
            ) : (
              <AvatarImage src={job?.company?.logo} />
            )}
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={'text-blue-700 font-bold'} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() =>
            user ? navigate(`/description/${job?._id}`) : navigate('/login')
          }
          variant="outline"
        >
          Details
        </Button>
        <Button
          className="bg-[#7209b7] text-white"
          onClick={() => (user ? saveJobHandler(job) : navigate('/login'))}
        >
          {isSaved ? 'Remove' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

Job.propTypes = {
  job: PropTypes.object.isRequired,
  removeJobHandler: PropTypes.func.isRequired,
};

export default Job;
