---
title: Guidelines
layout: page
---
# Guidelines

"Over the years, ReconOS has been used to implement several applications on hybrid CPU/FPGA systems. These experiences have confirmed that the hybrid multi-threading approach offered by ReconOS simplifies the development process, which is typically structured in three steps:

## Step 1: Multithreaded software on general-purpose CPU

The developer prototypes the application's functionality in multi-threaded software using, for example, the Pthreads library on Linux. This first software-based implementation allows for functional testing. 

## Step 1: Multithreaded software on embedded CPU

The multi-threaded software is ported to the embedded CPU on the targeted platform FPGA, e.g., a MicroBlaze running Linux. The developer can now use profiling to identify the application's potential for parallel execution, i.e., those threads that could benefit from the fine-grained parallelism of a hardware realization, and those code segments that are amenable to a coarser-grained parallel implementation with multiple threads. 

## Step 1: Hardware / software co-design

ReconOS easily allows the developer to evaluate different mappings of threads to hardware and software and to quickly assess the overall performance on the target system."

<cite>ReconOS – an operating system approach for reconfigurable computing</cite>
