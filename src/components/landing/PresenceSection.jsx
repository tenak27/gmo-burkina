import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import { MapPin, Truck, Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

const CITIES = [
{ name: "Ouagadougou", lat: 12.3714, lng: -1.5197, status: "active", role: "Siège Social & Hub Principal", details: "Centre de distribution principal, siège de GMO" },
{ name: "Bobo-Dioulasso", lat: 11.177, lng: -4.2979, status: "active", role: "Antenne Régionale", details: "2ème ville du Burkina, hub de distribution Ouest" },
{ name: "Diébougou", lat: 10.9618, lng: -3.2514, status: "active", role: "Point de Distribution", details: "Couverture de la région du Sud-Ouest" },
{ name: "Pô", lat: 11.175, lng: -1.147, status: "active", role: "Point de Distribution", details: "Couverture de la région du Centre-Sud" },
{ name: "Boromo", lat: 11.7444, lng: -2.9286, status: "active", role: "Point de Distribution", details: "Couverture de la région des Balé" },
{ name: "Dori", lat: 14.0350, lng: -0.0350, status: "active", role: "Point de Distribution", details: "Couverture de la région du Sahel" },
{ name: "Banfora", lat: 10.6338, lng: -4.7605, status: "coming", role: "Expansion prévue", details: "Ouverture bientôt" }];


const INTERNATIONAL = [
{ name: "Mali", status: "Très bientôt" },
{ name: "Niger", status: "Très bientôt" },
{ name: "Côte d'Ivoire", status: "Très bientôt" }];


export default function PresenceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState(null);

  const activeCities = CITIES.filter((c) => c.status === "active").length;

  return null;





















































































































































































}