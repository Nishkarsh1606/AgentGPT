import React, { useEffect, useRef } from "react";
import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import type { Message } from "../components/ChatWindow";
import ChatWindow from "../components/ChatWindow";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/motions/popin";
import { VscLoading } from "react-icons/vsc";
import AutonomousAgent from "../components/AutonomousAgent";
import Expand from "../components/motions/expand";
import HelpDialog from "../components/HelpDialog";
import SettingsDialog from "../components/SettingsDialog";
import { GPT_35_TURBO, DEFAULT_MAX_LOOPS_FREE } from "../utils/constants";
import { TaskWindow } from "../components/TaskWindow";
import { useAuth } from "../hooks/useAuth";

const Home: NextPage = () => {
  const { session, status } = useAuth();
  const [name, setName] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [agent, setAgent] = React.useState<AutonomousAgent | null>(null);
  const [customApiKey, setCustomApiKey] = React.useState<string>("");
  const [customModelName, setCustomModelName] =
    React.useState<string>(GPT_35_TURBO);
  const [customTemperature, setCustomTemperature] = React.useState<number>(0.9);
  const [customMaxLoops, setCustomMaxLoops] = React.useState<number>(
    DEFAULT_MAX_LOOPS_FREE
  );
  const [shouldAgentStop, setShouldAgentStop] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([]);

  const [showHelpDialog, setShowHelpDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);

  // TODO: enable for crud
  // const utils = api.useContext();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // const voidFunc = () => {};
  // const createAgent = api.agent.create.useMutation({
  //   onSuccess: (data) => {
  //     utils.agent.getAll.setData(voidFunc(), (oldData) => [
  //       ...(oldData ?? []),
  //       data,
  //     ]);
  //   },
  // });

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (agent == null) {
      setShouldAgentStop(false);
    }
  }, [agent]);

  const handleAddMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const tasks = messages.filter((message) => message.type === "task");

  const handleNewGoal = () => {
    // TODO: enable for crud
    // if (env.NEXT_PUBLIC_VERCEL_ENV != "production" && session?.user) {
    //   createAgent.mutate({
    //     name,
    //     goal: goalInput,
    //   });
    // }
    const agent = new AutonomousAgent(
      name,
      goalInput,
      handleAddMessage,
      () => setAgent(null),
      { customApiKey, customModelName, customTemperature, customMaxLoops },
      session ?? undefined
    );
    setAgent(agent);
    agent.run().then(console.log).catch(console.error);
  };

  const handleStopAgent = () => {
    setShouldAgentStop(true);
    agent?.stopAgent();
  };

  const proTitle = (
    <>
      Findr<span className="ml-1 text-amber-500/90">AI</span>
    </>
  );

  return (
    <DefaultLayout>
      {/* <HelpDialog
        show={showHelpDialog}
        close={() => setShowHelpDialog(false)}
      /> */}
      {/* <SettingsDialog
        reactModelStates={{
          customApiKey,
          setCustomApiKey,
          customModelName,
          setCustomModelName,
          customTemperature,
          setCustomTemperature,
          customMaxLoops,
          setCustomMaxLoops,
        }}
        show={showSettingsDialog}
        close={() => setShowSettingsDialog(false)}
      /> */}
      <main className="flex min-h-screen flex-row">
        {/* <Drawer
          showHelp={() => setShowHelpDialog(true)}
          showSettings={() => setShowSettingsDialog(true)}
        /> */}
        <div
          id="content"
          className="z-10 flex min-h-screen w-full items-center justify-center p-2 px-2 sm:px-4 md:px-10"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-lg flex-col items-center justify-between gap-3 py-5 md:justify-center"
          >
            <div
              id="title"
              className="relative flex flex-col items-center font-mono"
            >
              <div className="flex flex-row items-start shadow-2xl">
                <span className="text-4xl font-bold text-[#ffffff] xs:text-5xl sm:text-6xl">
                  Findr Workflows
                </span>
              </div>
            </div>

            <Expand className="flex w-full flex-row">
              <ChatWindow
                className="sm:mt-4"
                messages={messages}
                title={session?.user.subscriptionId ? proTitle : "Findr Assistant"}
                showDonation={
                  status != "loading" && !session?.user.subscriptionId
                }
              />
              {tasks.length > 0 && <TaskWindow tasks={tasks} />}
            </Expand>

            <div className="flex w-full flex-col gap-2 sm:mt-4 md:mt-10">
              <Expand delay={1.2}>
                <Input
                  inputRef={nameInputRef}
                  left={
                    <>
                      <FaRobot />
                      <span className="ml-2">Assistant:</span>
                    </>
                  }
                  value={name}
                  disabled={agent != null}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Findr Workflows"
                />
              </Expand>
              <Expand delay={1.3}>
                <Input
                  left={
                    <>
                      <FaStar />
                      <span className="ml-2">Tasks:</span>
                    </>
                  }
                  disabled={agent != null}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="Email pasta recipe to my co founder"
                />
              </Expand>
            </div>

            <Expand delay={1.4} className="flex gap-2">
              <Button
                disabled={agent != null || name === "" || goalInput === ""}
                onClick={handleNewGoal}
                className="sm:mt-10"
              >
                {agent == null ? (
                  "Deploy Assistant"
                ) : (
                  <>
                    <VscLoading className="animate-spin" size={20} />
                    <span className="ml-2">Executing</span>
                  </>
                )}
              </Button>
              {/* <Button
                disabled={agent == null}
                onClick={handleStopAgent}
                className="sm:mt-10"
                enabledClassName={"bg-red-600 hover:bg-red-400"}
              >
                {shouldAgentStop ? (
                  <>
                    <VscLoading className="animate-spin" size={20} />
                    <span className="ml-2">Stopping</span>
                  </>
                ) : (
                  "Stop agent"
                )}
              </Button> */}
            </Expand>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
