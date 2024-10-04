const PetCardSkeleton: React.FC = () => {
    return (
      <div className="w-full h-full md:w-[350px] md:h-[600px] rounded-2xl bg-gray-200 animate-pulse p-6 flex flex-col justify-between">
        <div className="bg-gray-300 h-80 rounded-lg"></div> 
        <div className="space-y-4">
          <div className="bg-gray-300 h-6 w-1/3 rounded-lg"></div> 
          <div className="bg-gray-300 h-6 w-2/3 rounded-lg"></div> 
          <div className="bg-gray-300 h-6 rounded-lg"></div> 
        </div>
      </div>
    );
  };
  
  export default PetCardSkeleton;
  