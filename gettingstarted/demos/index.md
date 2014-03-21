---
title: Demo Builds
layout: page
---
# Demo Builds

To get a first impression of ReconOS without fiddling around with
the development and build process, we provide prebuilt images for
different development boards, including several example applications.
You can simply download and exctract them to your SD/CF card and have
a working ReconOS system. Detailed instructions how to set up your
board are provided in the following sections.

After you have followed the setup steps, you should
see a Linux shell you can play around with. In the
`/opt/reconos` directory you will find a script called `reconos_demo.sh`
and several folders, each one containing a single demo application.
You can execute a demo by calling `./reconos_demo.sh <demo name>` where
`<demo name>` is one of the folder names.
So play around and have fun!

Currently only demo builds for the ZedBoard are available, but we will
provide further images for different boards soon.

## Demo Descriptions

### Sort Demo
The sort demo is the well known demo application for ReconOS. It sorts a
bunch of data by using both hardware and software threads and demonstrates
the possible performance benefits from using hardware threads.

The sort demo takes three parameters, the number of hardware threads (max. 16),
the number of software threads and the number of blocks you want to sort.
As a result, you get a report of the sorting times.

### Sort Demo Visual
The visual sort demo an extension of the classical sort demo. It introduces a
ncurses based visualization of the sort rate and allows to change
the number of hardware and software threads.

You can call this application without parameters and change the number of
threads using your arrow keys. To exit, hit `Ctrl+C`.

## ZedBoard

### SD Card and Board Setup
After downloading the boot files, extract them to the
SD card shipped with your ZedBoard. Then insert the SD card into
the ZedBoard slot on the right and adjust Jumpers `MIO2` to `MIO6`
to the follwing configuration:

| Jumper   | Function                             | Setting |
|----------|--------------------------------------|---------|
| `MIO2`   | JTAG Mode (Cascaded, Independent)    | `GND`   |
| `MIO3`   | Boot Device (JTAG, Quad-SPI, SD Card | `GND`   | 
| `MIO4`   | Boot Device (JTAG, Quad-SPI, SD Card | `3V3`   | 
| `MIO5`   | Boot Device (JTAG, Quad-SPI, SD Card | `3V3`   | 
| `MIO6`   | PLL Mode                             | `GND`   |

If not already done, connect the UART to your PC, turn the board
on and connect via a terminal emulator to your board using a baud rate
of 115200, for example using picocom:

```
> picocom /dev/ttyACM0 -b 115200
```

### Resources
* Boot files &#91;[zedboard.tar.gz](zedboard.tar.gz)&#93;
* Device photo &#91;zedboard.jpg&#93;