import { useSelector } from 'react-redux';
import Loader from './Loader';

const LoadingWrapper = ({ children }) => {
  const loadingStates = useSelector(state => ({
    authLoading: state.auth?.loading,
    projectsLoading: state.projects?.loading,
    timeEntriesLoading: state.timeEntries?.loading
  }));

  const isLoading = Object.values(loadingStates).some(loading => loading);

  return (
    <>
      {children}
      <Loader loading={isLoading} />
    </>
  );
};

export default LoadingWrapper;