
const hiddenSidebarRoutes = ['/login','/settings'];

export const useSidebarVisibility = () => {
  const route = useRoute();
  console.log("1111111111111111");
1
  console.log("route", route.path);

  const isSidebarVisible = () => {
    return !hiddenSidebarRoutes.includes(route.path);
  };


  return {
    isSidebarVisible,
  };
};