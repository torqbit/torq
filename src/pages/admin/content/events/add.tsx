import Layout2 from "@/components/Layouts/Layout2";
import EventForm from "@/components/Events/EventForm";
import { NextPage } from "next";

const EventFormPage: NextPage = () => {
  return (
    <>
      <Layout2>
        <EventForm />
      </Layout2>
    </>
  );
};

export default EventFormPage;
