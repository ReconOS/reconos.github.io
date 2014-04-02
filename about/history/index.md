---
title: History
layout: page
---
# History

ReconOS has been actively developed since its inception in 2006.
Since then it has gone through three major revisions and has
been ported to several operating systems and hardware platforms.

![Major Revisions of ReconOS]({{ site.url }}/assets/images/timeline.svg)

## Version 1

ReconOS v1.0 was the very first version developed by Enno Lübbers
within his PhD-Thesis and published in *Enno Lübbers and Marco Platzner.
ReconOS: An RTOS supporting Hard- and Software Threads*.
It used the eCos operating system running on PowerPC CPUs
embedded in Xilinx Virtex-2 Pro and Virtex-4 FPGAs.

## Version 2

ReconOS v2.0 improved on the original version by providing FIFO
interconnects between hardware threads, adding support for the Linux
operating system, and offering a common virtual address space between
hardware and software threads.

## Version 3

ReconOS v3.0, which was released in early 2013, is a major overhaul
that streamlines the hardware architecture towards a more lightweight
and modular design. It brings ReconOS to the Microblaze/Linux and
Microblaze/Xilkernel architectures and has been used extensively
on Virtex-6 FPGAs. ReconOS v3.1 switches from the old PLB-Bus to
a new AXI based architecture and supports the Xilinx Zynq platform.
