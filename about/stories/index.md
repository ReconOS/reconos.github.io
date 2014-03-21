---
title: Success Stories
layout: page
---
# Success Stories

## Dynamic partial reconfiguration

"ReconOS defines a standardized interface for hardware threads, which simplifies exchanging them, not only at design time but also during runtime using dynamic partial reconfiguration (DPR). DPR allows for exploiting FPGA resources in unconventional ways, for example, by loading hardware threads on demand, moving functionality between software and hardware, or even multi-tasking hardware slots by time-multiplexing. ReconOS supports DPR by dividing the architecture in a static and a dynamic part. The static part contains the processor, the memory subsystem, OSIFs, MEMIFs, and peripherals. The dynamic part is reserved for hardware threads, which can be reconfigured into the hardware slots. Our DPR tool flow builds on Xilinx PlanAhead and creates the static subsystem and the partial bitstreams for each desired hardware thread/slot combination. Time-multiplexing of hardware slots is supported through cooperative multi-tasking.


## Adaptive network architectures

Researchers at ETH Zurich use ReconOS to implement adaptive network architectures that continuously optimize the network protocol stack on a per-application basis to cope with varying transmission characteristics, security requirements, and compute resources availability. The developed architecture autonomously adapts itself by offloading performance-critical, network processing tasks to hardware threads, which are loaded at runtime using dynamic partial reconfiguration.


## Self-adaptive and self-aware computing systems

Another line of research also leverages the unified software/hardware interface and partial reconfiguration to create self-adaptive and self-aware computing systems that autonomously optimize performance goals under varying workloads. In the EPiCS project funded by the European Commission, researchers of the University of Paderborn even advance the autonomy of computing systems and enable them to optimize for diverse goals such as performance, energy consumption, and chip temperature based on the current quality-of-service requirements, workload characteristics and system state."

<cite>ReconOS – an operating system approach for reconfigurable computing</cite>
