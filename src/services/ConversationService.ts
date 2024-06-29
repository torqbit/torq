import { Conversation } from "@prisma/client";
import { getFetch, postFetch } from "./request";
import { IConversationData } from "@/pages/api/v1/conversation/list";

export interface IConversationList extends Conversation {
  user: {
    name: string;
    image: string;
    id: string;
  };
}

export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
  conversationList: IConversationList[];
  conversation: IConversationList;
  comments: IConversationData[];
};

type FailedApiResponse = {
  error: string;
};
class ConversationService {
  addConversation = (
    comment: string,
    parentConversationId: number | undefined,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ comment: comment, parentConversationId: parentConversationId }, `/api/v1/conversation/add`).then(
      (result) => {
        if (result.status == 400) {
          result.json().then((r) => {
            const failedResponse = r as FailedApiResponse;
            onFailure(failedResponse.error);
          });
        } else if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as ApiResponse;
            onSuccess(apiResponse);
          });
        }
      }
    );
  };
  getAllConversation = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/conversation/list`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getAllConversationById = (
    conversationId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/conversation/get-conversation-by-Id?conversationId=${conversationId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getAllParentConversation = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/conversation/get-parent-conversation`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  countLatestNotification = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/notification/get/latest-notification`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  updateConversation = (
    comment: string,
    conversationId: number,
    authorId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(
      { comment: comment, conversationId: conversationId, authorId: authorId },
      `/api/v1/conversation/update-comment`
    ).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  updateViewState = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/conversation/update-comment`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
}

export default new ConversationService();
