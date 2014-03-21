---
title: Objectives
layout: page
---
# Objectives

"The ReconOS operating system, programming model and system architecture offers unified operating system services for functions executing in software and hardware and a standardized interface for integrating custom hardware accelerators.

ReconOS leverages the well-established multi-threading programming model and extends a host operating system with support for hardware threads. These extensions allow the hardware threads to interact with software threads using the same, standardized operating system mechanisms, for example, semaphores, mutexes, condition variables, and message queues. From the perspective of an application it is thus completely transparent whether a thread is executing in software or hardware. The availability of an operating system layer providing symmetry between software and hardware threads provides the following benefits for reconfigurable computing systems:

* The application development process can be structured in a step-by-step fashion with an all-in-software implementation as a starting point. Performance-critical application parts can then be turned into hardware threads one-by-one to explore the hardware/software design space successively.

* The portability of applications between different reconfigurable computing systems is improved by using defined operating system interfaces for communication and synchronization instead of low-level platform-specific interfaces.
 
* The unified appearance of hard and software threads from the application's perspective allows for moving functions between software and hardware during runtime, which supports the design of adaptive computing systems that exploit partial reconfiguration."

<cite>ReconOS – an operating system approach for reconfigurable computing</cite>


Over the years, ReconOS has been used to implement several applications on hybrid CPU/FPGA systems. These experiences have confirmed that the hybrid multi-threading approach offered by ReconOS simplifies the development process, which is typically structured in three steps:

* First, the developer prototypes the application's functionality in multi-threaded software using, for example, the Pthreads library on Linux. This first software-based implementation allows for functional testing. 

* Second, the multi-threaded software is ported to the embedded CPU on the targeted platform FPGA, e.g., a MicroBlaze running Linux. The developer can now use profiling to identify the application's potential for parallel execution, i.e., those threads that could benefit from the fine-grained parallelism of a hardware realization, and those code segments that are amenable to a coarser-grained parallel implementation with multiple threads. 

* The third step includes creating the hardware threads and the ReconOS system architecture. At this point, ReconOS easily allows the developer to evaluate different mappings of threads to hardware and software and to quickly assess the overall performance on the target system."

<cite>ReconOS – an operating system approach for reconfigurable computing</cite>
