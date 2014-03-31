---
title: ReconOS Tool Flow
layout: page
---
# ReconOS Tool Flow

"The required sources comprise the software threads, the hardware threads and the specification of the ReconOS hardware architecture. 
We code software threads in **C** and hardware threads in **VHDL**, using the ReconOS-provided VHDL libraries for OS communication and memory access.

![The ReconOS Toolflow]({{ site.url }}/assets/images/toolflow.svg)

ReconOS extends the process for building a reconfigurable system-on-chip using standard **vendor tools**. On the software side, the delegate threads and **device drivers** for transparent communication with hardware threads are linked into the application executable and kernel image, respectively. On the hardware side, components such as the OS and memory interfaces as well as support logic for hardware threads are integrated into the tool flow.

The **ReconOS System Builder** assembles the base system design and the hardware threads into a reference design and automatically connects bus interfaces, interrupts, and I/O. The build process then creates an FPGA configuration bitstream for the reference design using conventional synthesis and implementation tools.

During design space exploration, the developer will create both hardware and software implementations for some of the threads. Switching between these implementations is a matter of replacing a single thread instantiation statement,  e.g., using **rthread_create()** instead of **pthread_create()**. Such a decision for software or hardware can even be taken during runtime."

<cite>ReconOS – an operating system approach for reconfigurable computing</cite>


