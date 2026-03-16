import 'primereact/resources/themes/lara-dark-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './MenuBar.css';
import { Menubar } from 'primereact/menubar';
import sbitLogo from '../assets/sbit_logo.png';
import { useNavigate } from "react-router-dom";

export default function SimpleMenuBar() {
  const navigate = useNavigate(); // <-- hook must be inside the component

  const items = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => navigate('/') },
    { 
      label: 'Teacher', icon: 'pi pi-fw pi-users', 
      items: [
        { label: 'View List', icon: 'pi pi-fw pi-eye', command: () => navigate('/teachers') },
        { label: 'Add Teacher', icon: 'pi pi-fw pi-user-plus', command: () => navigate('/teachers/add') }
      ]
    },
    { 
      label: 'Student', icon: 'pi pi-fw pi-graduation-cap', 
      items: [
        { label: 'View List', icon: 'pi pi-fw pi-eye', command: () => navigate('/students') },
        { label: 'Add Student', icon: 'pi pi-fw pi-user-plus', command: () => navigate('/students/add') }
      ]
    },
    { 
      label: 'Course', icon: 'pi pi-fw pi-book', 
      items: [
        { label: 'View List', icon: 'pi pi-fw pi-eye', command: () => navigate('/courses') },
        { label: 'Add Course', icon: 'pi pi-fw pi-plus', command: () => navigate('/courses/add') }
      ]
    },
    { label: 'Grades', icon: 'pi pi-chart-bar', command: () => navigate('/grades') }
  ];

  const start = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img alt="logo" src={sbitLogo} width="110" style={{ marginLeft: '3rem', borderRadius: '8px' }}/>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 5, left: 0, right: 0, zIndex: 1000 }}>
      <Menubar model={items} className="custom-menubar" start={start} />
    </div>
  );
}
