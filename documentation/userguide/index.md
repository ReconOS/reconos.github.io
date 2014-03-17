---
title: User Guide
layout: page
---
# User Guide

This guide should give you an introduction into the development of
applications with ReconOS. You will understand how to implement your
hardware and software threads and how to synchronize them by using
the mechanisms provided by ReconOS.

## The Example Application

To focus on ReconOS and how to use its services, we will start with
an easily understandable application, a simple adder thread implemented
in both software and hardware, which receives two numbers,
adds them and sends the result back. The synchronization and message
exchange should be done via an mbox, a commonly used synchronization
primitive. You can image an mbox as a synchronized message storage,
where different threads can put and get words into or from, respectively.

## The Hardware Thread

At first we want to focus on the hardware thread. It is implemented
as an IP-Core used in the Xilinx Platform Studio and is connected to
the ReconOS system via a specified interface. At first we want to briefly
cover the structure of the IP-Core, used to implement a ReconOS hardware
thread. Then we will take a detailed look at its structure and how the
communication with other threads can be done.

### The Hardware Thread as an IP-Core

An IP-Core for the Xilinx Platform studio consists out of several files:

```
hwt_simple_adder_v1_00_a
+- data
|  +- hwt_simple_adder_v2_1_0.mpd
|  +- hwt_simple_adder_v2_1_0.pao
|
+- hdl
   +- vhdl
      +- ...
```

Under the `data` directory are some management files used by XPS. The `mpd`
(Microprocessor Peripheral Definition) specifies the input and output
signals of the IP-Core as they are noticed by XPS and its types, as well
as the definition of the bus interfaces. It also includes some general
options. The following listing shows two lines, specifying two inputs.

```
PORT HWT_Clk = "", DIR = I, SIGIS = Clk
PORT HWT_Rst = "", DIR = I, SIGIS = Rst
```

The `pao` (Platform Format Specification) lists external resources needed
for synthesis, for example:

```
lib proc_common_v3_00_a  proc_common_pkg vhdl
lib reconos_hwt_idle_v1_00_a reconos_hwt_idle vhdl
```

The `hdl` folder includes the actual implementation of the IP-Core written
in VHDL or Verilog. It must include an entity named exactly like the IP-Core
and must have at least the ports specified in the `mpd`.

### Main Entity

The following listing shows the main entity of a common hardware thread. It specifies
the mandatory signals for the OSIF and MEMIF and also a clock and reset signal. For
further descriptions on these interfaces you can take a look at the architecture
description of ReconOS.

Additionally to theses mandatory ports you can also add you own ones to connect the
hardware thread to other resources.

```vhdl
entity hwt_simple_adder is
	port (
		-- OSIF FIFO ports
		OSIF_FIFO_Sw2Hw_Data    : in  std_logic_vector(31 downto 0);
		OSIF_FIFO_Sw2Hw_Fill    : in  std_logic_vector(15 downto 0);
		OSIF_FIFO_Sw2Hw_Empty   : in  std_logic;
		OSIF_FIFO_Sw2Hw_RE      : out std_logic;

		OSIF_FIFO_Hw2Sw_Data    : out std_logic_vector(31 downto 0);
		OSIF_FIFO_Hw2Sw_Rem     : in  std_logic_vector(15 downto 0);
		OSIF_FIFO_Hw2Sw_Full    : in  std_logic;
		OSIF_FIFO_Hw2Sw_WE      : out std_logic;

		-- MEMIF FIFO ports
		MEMIF_FIFO_Hwt2Mem_Data    : out std_logic_vector(31 downto 0);
		MEMIF_FIFO_Hwt2Mem_Rem     : in  std_logic_vector(15 downto 0);
		MEMIF_FIFO_Hwt2Mem_Full    : in  std_logic;
		MEMIF_FIFO_Hwt2Mem_WE      : out std_logic;

		MEMIF_FIFO_Mem2Hwt_Data    : in  std_logic_vector(31 downto 0);
		MEMIF_FIFO_Mem2Hwt_Fill    : in  std_logic_vector(15 downto 0);
		MEMIF_FIFO_Mem2Hwt_Empty   : in  std_logic;
		MEMIF_FIFO_Mem2Hwt_RE      : out std_logic;

		HWT_Clk   : in  std_logic;
		HWT_Rst   : in  std_logic
	);
end entity hwt_simple_adder;
```

### Implementation
A hardware thread in ReconOS is separated into two components,
a sequential part managing the synchronization with other threads
and a user logic part implementing the actual processing logic.
The sequential part is implemented by a state machine - in ReconOS
called the OS-FSM - which includes calls to different functions provided
by ReconOS. In contrast to the OS-FSM the user logic is not limited to
any structure and can exploit all benefits from design a custom hardware.
Naturally the parallel logic must be synchronized to the sequential part
via some control signals.

In our example the processing logic is rather simple and therefore we
do not need a separate entity. Instead we implement our adding logic
directly inside of the OS-FSM.

So lets take a look into the implementation of our adder thread and explain
the relevant parts.

#### Setup functions
Since the interfaces of ReconOS consists out of several signals, it would
be inconvenient to specify all of them in every single call of a ReconOS
function. Therefore, these signals are encapsulated in several records which
must be declared as a signal and initialized using special setup functions.
The declaration is done as a normal signals

```vhdl
signal i_osif   : i_osif_t;
signal o_osif   : o_osif_t;
signal i_memif  : i_memif_t;
signal o_memif  : o_memif_t;
```

and the setup functions are called asynchronously in the main entity.

```vhdl
osif_setup (
	i_osif,
	o_osif,
	OSIF_FIFO_Sw2Hw_Data,
	OSIF_FIFO_Sw2Hw_Fill,
	OSIF_FIFO_Sw2Hw_Empty,
	OSIF_FIFO_Hw2Sw_Rem,
	OSIF_FIFO_Hw2Sw_Full,
	OSIF_FIFO_Sw2Hw_RE,
	OSIF_FIFO_Hw2Sw_Data,
	OSIF_FIFO_Hw2Sw_WE
);

memif_setup (
	i_memif,
	o_memif,
	MEMIF_FIFO_Mem2Hwt_Data,
	MEMIF_FIFO_Mem2Hwt_Fill,
	MEMIF_FIFO_Mem2Hwt_Empty,
	MEMIF_FIFO_Hwt2Mem_Rem,
	MEMIF_FIFO_Hwt2Mem_Full,
	MEMIF_FIFO_Mem2Hwt_RE,
	MEMIF_FIFO_Hwt2Mem_Data,
	MEMIF_FIFO_Hwt2Mem_WE
);
```

Besides these setup functions, it is also recommended to specify
a `clk` and `rst` signal

```vhdl
signal clk   : std_logic;
signal rst   : std_logic;
```

and assign them the `HWT_Clk` and `HWT_Rst` signals.

```vhdl
clk <= HWT_Clk;
rst <= HWT_Rst;
```

#### OS-FSM
The OS-FSM is the sequential part of our hardware thread and manages
the synchronization with other threads and allows to perform system calls
via provided ReconOS functions. The common way to specify a state machine
is by declaring a state type and a signal with this type.

```vhdl
type STATE_TYPE is (STATE_GET_FIRST, STATE_GET_SECOND, STATE_CALC, STATE_RESULT);
signal state : STATE_TYPE;
```

Then we can specify a process and implement our state machine. Inside this
process we also must handle resets of our hardware thread by calling the
appropriate reset functions and resetting user signals.

```vhdl
reconos_fsm: process (clk,rst,o_osif,o_memif) is
	variable done  : boolean;
begin
	if rst = '1' then
		osif_reset(o_osif);
		memif_reset(o_memif);
	elsif rising_edge(clk) then
		case state is
			when STATE_GET_FIRST =>
			when STATE_GET_SECOND =>
			when STATE_CALC =>
			when STATE_RESULT =>
			when others =>
		end case;
	end if;
end process reconos_fsm;
```

#### Call of a ReconOS function
Before we start to implement our state machine, we want to briefly cover
the usual mechanisms how synchronous ReconOS functions are called.
All synchronous ReconOS functions have a similar structure:

```vhdl
osif_call(i_osif, o_osif, <resource id>, <return value>, ..., done);
```

The first parameters are the `i_osif` and `o_osif` records defined earlier,
then a resource id, some method specific parameters and a done flag. The
resource id specifies the actual resource to use and will be explained
in the next section. The done flag is used to model a synchronous
call and is set to true, when the call is finished. Therefore, we must check the
done variable and go to the next state if the variable is true. Lets take a
look at a real world example:

```vhdl
when STATE_CURRENT =>
	osif_mbox_get(i_osif, o_osif, MBOX_RECV, data, done);
	if done then
		state <= NEXT_STATE;
	end if;
```

This pattern of a ReconOS function calls occurs again and again for all synchronous
calls.

#### The Mysterious resource id
In the previous section we mentioned the resource id to specify the resource to use.
Now we want to explain how this mechanism works. The resources like semaphores or
mboxes are managed by the operating system running on the processor. The software
application allocates these resources and can be accessed via appropriate pointers.
Since the hardware thread has no access to these pointers directly, it must specify
the resource by another mechanism. Therefore, to each hardware thread an array of resources
is associated. This array includes just these pointers and allow the hardware thread
to specify a resource by the index inside this array. This exactly is the resource id
provided in the osif-call. For convenient use we recommend to specify some constants
representing these ids. For our adder example we need the following resources to
receive values and send our result back:

```vhdl
constant MBOX_RECV  : std_logic_vector(31 downto 0) := x"00000000";
constant MBOX_SEND  : std_logic_vector(31 downto 0) := x"00000001";
```

#### The Adder State Machine
Now we have all pieces together to write our adder logic. We first need to get two
words out of our receiving mbox, add the two numbers and write the result back to
the sending mbox. These four steps can be expressed very compactly in our state machine:

```vhdl
case state is
	when STATE_GET_FIRST =>
		osif_mbox_get(i_osif, o_osif, MBOX_RECV, v1, done);
		if done then
			state <= STATE_GET_SECOND;
		end if;

	when STATE_GET_SECOND =>
		osif_mbox_get(i_osif, o_osif, MBOX_RECV, v2, done);
		if done then
			state <= STATE_CALC;
		end if;

	when STATE_CALC =>
		sum <= v1 + v2;
		state <= STATE_RESULT;

	when STATE_RESULT =>
		osif_box_put(i_osif, o_osif, MBOX_SEND, sum, done);
		if done then
			state <= STATE_GET_FIRST;
		end if;

	when others =>
end case;
```

## The Software Thread
As we mentioned earlier, we want to implement the same functionality also as
a software thread. To keep both the hardware and software thread similar,
the software thread also uses mboxes to get the terms of the sum and to
return the result.

The software thread is simply a pthread and needs no more explanation. If you
are not familiar with pthreads, you will find man information about it on
the Internet.

```c
void *adder_thread(void *data) {
	struct reconos_resource *res = (struct reconos_resource*) data;
	struct mbox *mbox_recv = res[0].ptr;
	struct mbox *mb_send = res[1].ptr;

	int v1 = mbox_get(mb_recv);
	int v2 = mbox_get(mb_recv);

	int sum = v1 + v2;

	mbox_put(mb_send, sum);

	pthread_exit((void*)0);
}
```

## Initialization in Software
Now we have created both a software and hardware implementation of our
adder thread and we can initialize all of them. In our main method we need
to initialize the ReconOS system, create the resource needed and create
out threads.

### Initialization of ReconOS
To use ReconOS and your hardware threads, you mus first initialize the entire
system by calling `reconos_init()`. This method resets the hardware, creates and
initializes the internal datastructures and registers exit handlers. That is all
you need to do for the initialization. Do not forget to call `reconos_cleanup()`
at the end of your program.

### Creation of the Resources
In our adder example we only have two resources, the receiving and sending mbox.
Creating them is fairly easy by calling the appropriate functions:

```c
struct mbox *mb_recv;
struct mbox *mb_send;

mbox_init(mb_recv, 16);
mbox_init(mb_send, 16);
```

As already mentioned earlier, to each hardware thread a resource array is associated.
Therefore, we must create these array by creating a `struct reconos_resource` array and
setting its `ptr` and `type` property:

```c
struct reconos_resource res[2];

res[0].ptr = mb_recv;
res[0].type = RECONOS_RESOURCE_TYPE_MBOX;
res[1].ptr = mb_send;
res[1].type = RECONOS_RESOURCE_TYPE_MBOX;
```

### Creation of Threads
Since the software thread is implemented using the pthread library, you should know how
to create a software thread:

```c
pthread_t swt;

pthread_create(&swt, NULL, adder_thread, res);
```

Creation of a hardware thread is almost as simple as that:

```c
struct reconos_hwt hwt;

reconos_hwt_setresources(&hwt, res, 2);
reconos_hwt_create(&hwt, 0, NULL)
```

The `reconos_hwt_setresources(...)` method associates the hardware thread with
the resource array and `reconos_hwt_create(...)` creates the thread. The second
parameter indicates the slot the hardware thread is running in. The slot number
is specified by the position in the configuration used to create the hardware design.
