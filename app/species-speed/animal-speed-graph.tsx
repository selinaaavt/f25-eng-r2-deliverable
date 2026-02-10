/* eslint-disable */
"use client";
import { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";

// Define the type for animal data
type AnimalData = {
  name: string;
  speed: number;
  diet: string;
};

export default function AnimalSpeedGraph() {
  const graphRef = useRef(null);
  const [animalData, setAnimalData] = useState<AnimalData[]>([]);

  // Load CSV data
  useEffect(() => {
    csv("/sample_animals.csv", (d) => {
      return {
        name: d["name"] || "",
        speed: +(d["speed"] ?? 0),
        diet: d["diet"] || "",
      };
    }).then((data) => {
      setAnimalData(data);
    });
  }, []);

  useEffect(() => {
    if (!graphRef.current || animalData.length === 0) return;

    graphRef.current.innerHTML = "";

    const containerWidth = graphRef.current.clientWidth || 800;
    const containerHeight = graphRef.current.clientHeight || 600;
    const width = Math.max(containerWidth, 800);
    const height = Math.max(containerHeight, 500);
    const margin = { top: 70, right: 60, bottom: 200, left: 100 };

    const svg = select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // --- FILTER DATA: top 10 fastest animals per diet ---
    const dietGroups = { herbivore: [], carnivore: [], omnivore: [] };
    animalData.forEach((d) => {
      const diet = d.diet?.trim().toLowerCase();
      if (dietGroups[diet]) dietGroups[diet].push(d);
    });

    const filteredData = Object.values(dietGroups)
      .flatMap((group) => group.sort((a, b) => b.speed - a.speed).slice(0, 10));

    // Band scale for animals (x-axis)
    const x = scaleBand()
      .domain(filteredData.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Linear scale for speed (y-axis)
    const y = scaleLinear()
      .domain([0, max(filteredData, (d) => d.speed) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Ordinal scale for diet colors
    const color = scaleOrdinal()
      .domain(["herbivore", "carnivore", "omnivore"])
      .range(["#4bb84bff", "#db4c4cff", "#4493cbff"]);

    // Bars
    svg
      .append("g")
      .selectAll("rect")
      .data(filteredData)
      .join("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.speed))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.speed))
      .attr("fill", (d) => color(d.diet?.trim().toLowerCase()));

    // X axis (rotated labels)
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-65)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(axisLeft(y));

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Animal Speeds by Diet Type");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 4)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Speed (km/h)");

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 100}, 10)`);
    ["herbivore", "carnivore", "omnivore"].forEach((diet, i) => {
      const g = legend.append("g").attr("transform", `translate(0,${i * 20})`);
      g.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(diet));
      g.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(diet)
        .style("font-size", "12px");
    });
  }, [animalData]);

  return <div ref={graphRef} style={{ width: "100%", height: "600px" }} />;
}