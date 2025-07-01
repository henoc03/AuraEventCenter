// hooks/useCreateBooking.js
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DEFAULT_ROUTE = "http://localhost:1522";

export default function useCreateBooking() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState({});

  const [allZones, setAllZones] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});

  const [allMenus, setAllMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState({});

  const [allEquipments, setAllEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const userData = jwtDecode(token);
    fetch(`${DEFAULT_ROUTE}/users/${userData.id}`)
      .then(res => res.json())
      .then(setUser)
      .catch(() => null);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${DEFAULT_ROUTE}/services/`).then(res => res.json()),
      fetch(`${DEFAULT_ROUTE}/menus/`).then(res => res.json()),
      fetch(`${DEFAULT_ROUTE}/equipments/`).then(res => res.json()),
    ])
    .then(([services, menus, equipments]) => {
      setAllServices(services);
      setAllMenus(menus);
      setAllEquipments(equipments);
    })
    .finally(() => setLoading(false));
  }, []);

useEffect(() => {
  if (step1Data.date && step1Data.startTime && step1Data.endTime) {
    setLoading(true);

    fetch(`${DEFAULT_ROUTE}/zones/available`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: step1Data.date,
        startTime: step1Data.startTime,
        endTime: step1Data.endTime,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setAllZones(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }
}, [step1Data]);


  return {
    user,
    step,
    setStep,
    step1Data,
    setStep1Data,
    allZones,
    selectedRooms,
    setSelectedRooms,
    allServices,
    selectedServices,
    setSelectedServices,
    allMenus,
    selectedMenus,
    setSelectedMenus,
    allEquipments,
    selectedEquipments,
    setSelectedEquipments,
    loading
  };
}
